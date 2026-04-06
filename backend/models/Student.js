const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  yearOfJoining: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  sequence: {
    type: String,
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
  collegeEmail: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  personalEmail: {
    type: String,
    required: true
  },
  yearOfGraduation: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Student', StudentSchema);
