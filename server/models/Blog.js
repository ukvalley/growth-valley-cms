const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  ogImage: {
    type: String
  },
  canonicalUrl: {
    type: String
  }
}, { _id: false });

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  featuredImage: {
    type: String,
    default: null
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Strategy', 'Automation', 'Performance', 'Technology', 'Growth', 'General']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Author is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishDate: {
    type: Date,
    default: null
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    type: seoSchema,
    default: () => ({})
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ createdAt: -1 });

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute
  }
  
  // Set publishDate when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishDate) {
    this.publishDate = new Date();
  }
  
  next();
});

// Virtual for formatted date
blogSchema.virtual('formattedDate').get(function() {
  return this.publishDate ? this.publishDate.toISOString().split('T')[0] : null;
});

// Transform output
blogSchema.methods.toJSON = function() {
  const blog = this.toObject();
  delete blog.__v;
  return blog;
};

// Static to find published posts
blogSchema.statics.findPublished = function() {
  return this.find({ status: 'published', publishDate: { $lte: new Date() } })
    .sort({ publishDate: -1 })
    .populate('author', 'name email avatar');
};

module.exports = mongoose.model('Blog', blogSchema);