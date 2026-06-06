const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    membershipType: { type: String, enum: ['basic', 'premium', 'student'], required: true, default: 'basic' },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
