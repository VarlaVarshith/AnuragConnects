const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all users (directory)
router.get('/', auth, async (req, res) => {
  try {
    const { search, department, yearOfGraduation, currentCity } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    if (yearOfGraduation) {
      query.yearOfGraduation = parseInt(yearOfGraduation);
    }

    if (currentCity) {
      query.currentCity = { $regex: currentCity, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('connections', 'name department yearOfGraduation currentCompany');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('currentCity').optional().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('currentCompany').optional().isLength({ min: 2 }).withMessage('Company must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
