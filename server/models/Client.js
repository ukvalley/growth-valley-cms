const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  logo: {
    type: String,
    required: [true, 'Logo URL is required']
  },
  logoDark: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
clientSchema.index({ status: 1, order: 1 });
clientSchema.index({ featured: 1 });

// Transform output
clientSchema.methods.toJSON = function() {
  const client = this.toObject();
  delete client.__v;
  return client;
};

// Static to find active clients
clientSchema.statics.findActive = function() {
  return this.find({ status: 'active' })
    .sort({ order: 1, createdAt: -1 });
};

// Static to find featured clients
clientSchema.statics.findFeatured = function() {
  return this.find({ status: 'active', featured: true })
    .sort({ order: 1, createdAt: -1 });
};

module.exports = mongoose.model('Client', clientSchema);