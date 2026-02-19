const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    required: [true, 'Meta title is required'],
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required'],
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  ogImage: {
    type: String,
    default: null
  },
  canonicalUrl: {
    type: String,
    default: null
  }
}, { _id: false });

const pageSeoSchema = new mongoose.Schema({
  page: {
    type: String,
    required: [true, 'Page identifier is required'],
    unique: true,
    enum: ['home', 'solutions', 'industries', 'case-studies', 'company', 'contact', 'blog']
  },
  pageTitle: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true,
    maxlength: [100, 'Page title cannot exceed 100 characters']
  },
  seo: {
    type: seoSchema,
    required: true,
    default: () => ({
      metaTitle: '',
      metaDescription: ''
    })
  },
  customFields: [{
    key: { type: String, required: true },
    value: { type: String }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
pageSeoSchema.index({ page: 1 }, { unique: true });
pageSeoSchema.index({ isActive: 1 });

// Transform output
pageSeoSchema.methods.toJSON = function() {
  const pageSeo = this.toObject();
  delete pageSeo.__v;
  return pageSeo;
};

// Static to get all active SEO settings
pageSeoSchema.statics.getAllActive = function() {
  return this.find({ isActive: true });
};

// Static to get SEO for specific page
pageSeoSchema.statics.getByPage = function(page) {
  return this.findOne({ page, isActive: true });
};

module.exports = mongoose.model('PageSEO', pageSeoSchema);