const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  collegeEmail: {
    type: String,
    required: true,
    unique: true
  },
  personalEmail: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  yearOfJoining: {
    type: Number,
    required: true
  },
  yearOfGraduation: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  currentCity: {
    type: String,
    default: ''
  },
  currentCompany: {
    type: String,
    default: ''
  },
  passwordHash: {
    type: String,
    required: true
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  role: {
    type: String,
    enum: ['alumni', 'admin'],
    default: 'alumni'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
