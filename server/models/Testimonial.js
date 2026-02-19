const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: [true, 'Quote is required'],
    trim: true,
    maxlength: [1000, 'Quote cannot exceed 1000 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  designation: {
    type: String,
    trim: true,
    maxlength: [100, 'Designation cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
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
testimonialSchema.index({ status: 1, order: 1 });
testimonialSchema.index({ featured: 1 });

// Transform output
testimonialSchema.methods.toJSON = function() {
  const testimonial = this.toObject();
  delete testimonial.__v;
  return testimonial;
};

// Static to find active testimonials
testimonialSchema.statics.findActive = function() {
  return this.find({ status: 'active' })
    .sort({ order: 1, createdAt: -1 });
};

// Static to find featured testimonials
testimonialSchema.statics.findFeatured = function() {
  return this.find({ status: 'active', featured: true })
    .sort({ order: 1, createdAt: -1 });
};

module.exports = mongoose.model('Testimonial', testimonialSchema);