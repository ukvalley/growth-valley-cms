const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

// ============================================
// Public Routes
// ============================================

// @route   GET /api/content
// @desc    Get all pages (summary)
router.get('/', contentController.getAllPages);

// @route   GET /api/content/:page/structure
// @desc    Get content structure/schema for a page
router.get('/:page/structure', contentController.getPageStructure);

// @route   GET /api/content/:page
// @desc    Get all content for a specific page
router.get('/:page', contentController.getPageContent);

// @route   GET /api/content/:page/:section
// @desc    Get specific section from a page
router.get('/:page/:section', contentController.getSectionContent);

// ============================================
// Admin Routes (Protected)
// ============================================

// @route   POST /api/content/initialize
// @desc    Initialize default content for all pages
router.post('/initialize', protect, contentController.initializeDefaults);

// @route   POST /api/content/:page/reset
// @desc    Reset page content to defaults
router.post('/:page/reset', protect, contentController.resetPageContent);

// @route   PUT /api/content/:page
// @desc    Update entire page content
router.put('/:page', protect, contentController.updatePageContent);

// @route   PUT /api/content/:page/:section
// @desc    Update specific section on a page
router.put('/:page/:section', protect, contentController.updateSectionContent);

// @route   PUT /api/content/:page/seo
// @desc    Update SEO for a page
router.put('/:page/seo', protect, contentController.updateSEO);

// @route   DELETE /api/content/:page/:section
// @desc    Delete a section from a page
router.delete('/:page/:section', protect, contentController.deleteSectionContent);

module.exports = router;