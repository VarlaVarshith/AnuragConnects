const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const { sendOTP } = require('../config/email');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register - Step 1: Validate and send OTP
router.post('/register', [
  body('rollNo').matches(/^\d{2}[a-z]{2}\d{3}[a-z]\d{2}$/).withMessage('Invalid roll number format'),
  body('collegeEmail').isEmail().withMessage('Invalid college email'),
  body('personalEmail').isEmail().withMessage('Invalid personal email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rollNo, collegeEmail, personalEmail, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ rollNo });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Validate against students collection
    const student = await Student.findOne({ rollNo, collegeEmail });
    if (!student) {
      return res.status(400).json({ message: 'Invalid roll number or college email' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP token
    await OtpToken.findOneAndDelete({ rollNo }); // Remove any existing OTP
    const otpToken = new OtpToken({
      rollNo,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    await otpToken.save();

    // Send OTP to personal email
    const emailSent = await sendOTP(personalEmail, otp, student.name);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    // Store registration data temporarily (in a real app, use Redis or similar)
    const tempData = {
      rollNo,
      collegeEmail,
      personalEmail,
      password: await bcrypt.hash(password, 10),
      studentData: student
    };

    res.json({ 
      message: 'OTP sent to your personal email',
      tempToken: jwt.sign(tempData, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register - Step 2: Verify OTP and create user
router.post('/verify-otp', [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('tempToken').notEmpty().withMessage('Temporary token required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { otp, tempToken } = req.body;

    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback_secret');
    
    // Verify OTP
    const otpToken = await OtpToken.findOne({ rollNo: decoded.rollNo, otp });
    if (!otpToken) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create user
    const user = new User({
      rollNo: decoded.rollNo,
      collegeEmail: decoded.collegeEmail,
      personalEmail: decoded.personalEmail,
      name: decoded.studentData.name,
      department: decoded.studentData.department,
      yearOfJoining: decoded.studentData.yearOfJoining,
      yearOfGraduation: decoded.studentData.yearOfGraduation,
      section: decoded.studentData.section,
      number: decoded.studentData.number,
      passwordHash: decoded.password
    });

    await user.save();

    // Mark student as verified
    await Student.findOneAndUpdate({ rollNo: decoded.rollNo }, { isVerified: true });

    // Delete OTP token
    await OtpToken.findByIdAndDelete(otpToken._id);

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('rollNo').notEmpty().withMessage('Roll number required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rollNo, password } = req.body;

    // Find user
    const user = await User.findOne({ rollNo });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
