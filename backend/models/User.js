const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    trim: true
  },
  deviceId: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'BLOCKED'],
    default: 'PENDING'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  blockedReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

userSchema.index({ uid: 1, deviceId: 1 });

module.exports = mongoose.model('User', userSchema);