const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
const { protect } = require('../middleware/auth');

// Public routes
// @route   GET /api/seo
// @desc    Get all page SEO settings
router.get('/', seoController.getAllPageSEO);

// @route   GET /api/seo/:page
// @desc    Get SEO for specific page
router.get('/:page', seoController.getPageSEO);

// Protected routes - admin only
// @route   PUT /api/admin/seo/:page
// @desc    Create or update page SEO
router.put('/:page', protect, seoController.updatePageSEO);

// @route   DELETE /api/admin/seo/:page
// @desc   Delete page SEO
router.delete('/:page', protect, seoController.deletePageSEO);

module.exports = router;