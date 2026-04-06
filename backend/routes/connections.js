const express = require('express');
const Connection = require('../models/Connection');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user connections
router.get('/', auth, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ],
      status: 'accepted'
    })
    .populate('userId', 'name department yearOfGraduation currentCompany')
    .populate('friendId', 'name department yearOfGraduation currentCompany');

    const formattedConnections = connections.map(conn => {
      const friend = conn.userId.toString() === req.user._id.toString() 
        ? conn.friendId 
        : conn.userId;
      return friend;
    });

    res.json(formattedConnections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending connection requests
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Connection.find({
      friendId: req.user._id,
      status: 'pending'
    }).populate('userId', 'name department yearOfGraduation currentCompany');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send connection request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { userId: req.user._id, friendId: userId },
        { userId: userId, friendId: req.user._id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    const connection = new Connection({
      userId: req.user._id,
      friendId: userId
    });

    await connection.save();
    res.json({ message: 'Connection request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept/decline connection request
router.put('/request/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const connection = await Connection.findById(requestId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connection.friendId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    connection.status = status;
    await connection.save();

    // If accepted, add to both users' connections
    if (status === 'accepted') {
      await User.findByIdAndUpdate(connection.userId, {
        $addToSet: { connections: connection.friendId }
      });
      await User.findByIdAndUpdate(connection.friendId, {
        $addToSet: { connections: connection.userId }
      });
    }

    res.json({ message: `Connection request ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
