const mongoose = require('mongoose');

const OtpTokenSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600 // 10 minutes
  }
});

module.exports = mongoose.model('OtpToken', OtpTokenSchema);
