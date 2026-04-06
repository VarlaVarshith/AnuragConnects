const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all news
router.get('/', auth, async (req, res) => {
  try {
    const news = await News.find({ isPublished: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create news (admin only)
router.post('/', adminAuth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const news = new News({
      ...req.body,
      createdBy: req.user._id
    });

    await news.save();
    await news.populate('createdBy', 'name');

    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
