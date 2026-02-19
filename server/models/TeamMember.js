const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL to image
    default: '',
  },
  linkedin: {
    type: String,
    trim: true,
  },
  twitter: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Index for ordering
teamMemberSchema.index({ order: 1 });

module.exports = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);