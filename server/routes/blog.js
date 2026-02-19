const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { validation } = require('../middleware');

// Public routes
// @route   GET /api/blog
// @desc    Get all published blog posts
router.get('/', blogController.getBlogs);

// @route   GET /api/blog/categories
// @desc    Get blog categories
router.get('/categories', blogController.getCategories);

// @route   GET /api/blog/tags
// @desc    Get blog tags
router.get('/tags', blogController.getTags);

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
router.get('/:slug', blogController.getBlogBySlug);

// Admin routes (protected)
// @route   GET /api/blog/admin/all
// @desc    Get all blog posts (including drafts)
router.get('/admin/all', protect, blogController.getAdminBlogs);

// @route   GET /api/blog/admin/:id
// @desc    Get blog post by ID
router.get('/admin/:id', protect, blogController.getAdminBlogById);

// @route   POST /api/blog
// @desc    Create new blog post
router.post('/', protect, validation.validateBody(validation.schemas.createBlog), blogController.createBlog);

// @route   PUT /api/blog/:id
// @desc    Update blog post
router.put('/:id', protect, validation.validateBody(validation.schemas.updateBlog), blogController.updateBlog);

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
router.delete('/:id', protect, blogController.deleteBlog);

module.exports = router;