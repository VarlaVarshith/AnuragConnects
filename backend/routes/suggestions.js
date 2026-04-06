const express = require('express');
const User = require('../models/User');
const Connection = require('../models/Connection');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get AI-powered connection suggestions
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Get existing connections and pending requests
    const existingConnections = await Connection.find({
      $or: [
        { userId: currentUser._id },
        { friendId: currentUser._id }
      ]
    });

    const connectedUserIds = existingConnections.map(conn => 
      conn.userId.toString() === currentUser._id.toString() 
        ? conn.friendId.toString() 
        : conn.userId.toString()
    );

    // Add current user to exclude list
    connectedUserIds.push(currentUser._id.toString());

    // Find potential connections based on various criteria
    const suggestions = [];

    // 1. Same department and graduation year (batchmates)
    const batchmates = await User.find({
      _id: { $nin: connectedUserIds },
      department: currentUser.department,
      yearOfGraduation: currentUser.yearOfGraduation
    }).limit(5);

    suggestions.push(...batchmates.map(user => ({
      ...user.toObject(),
      reason: 'Batchmate from same department',
      score: 10
    })));

    // 2. Same current city
    if (currentUser.currentCity) {
      const sameCity = await User.find({
        _id: { $nin: connectedUserIds },
        currentCity: { $regex: currentUser.currentCity, $options: 'i' }
      }).limit(5);

      suggestions.push(...sameCity.map(user => ({
        ...user.toObject(),
        reason: `Alumni in ${currentUser.currentCity}`,
        score: 8
      })));
    }

    // 3. Same department but different years
    const sameDept = await User.find({
      _id: { $nin: connectedUserIds },
      department: currentUser.department,
      yearOfGraduation: { $ne: currentUser.yearOfGraduation }
    }).limit(5);

    suggestions.push(...sameDept.map(user => ({
      ...user.toObject(),
      reason: `${currentUser.department} department alumni`,
      score: 7
    })));

    // 4. Same company
    if (currentUser.currentCompany) {
      const sameCompany = await User.find({
        _id: { $nin: connectedUserIds },
        currentCompany: { $regex: currentUser.currentCompany, $options: 'i' }
      }).limit(5);

      suggestions.push(...sameCompany.map(user => ({
        ...user.toObject(),
        reason: `Works at ${currentUser.currentCompany}`,
        score: 9
      })));
    }

    // Remove duplicates and sort by score
    const uniqueSuggestions = suggestions.reduce((acc, current) => {
      const existing = acc.find(item => item._id.toString() === current._id.toString());
      if (!existing) {
        acc.push(current);
      } else if (current.score > existing.score) {
        const index = acc.findIndex(item => item._id.toString() === current._id.toString());
        acc[index] = current;
      }
      return acc;
    }, []);

    // Sort by score and limit results
    const finalSuggestions = uniqueSuggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ passwordHash, ...user }) => user); // Remove password hash

    res.json(finalSuggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
