const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { validation, rateLimiter } = require('../middleware');
const { protect } = require('../middleware/auth');

// Public route - contact form submission
// @route   POST /api/contact
// @desc    Submit contact enquiry (public, rate limited)
router.post('/', rateLimiter.contactLimiter, validation.validateBody(validation.schemas.contactForm), enquiryController.createEnquiry);

// Protected routes - admin only
// @route   GET /api/admin/enquiries
// @desc    Get all enquiries
router.get('/', protect, enquiryController.getEnquiries);

// @route   GET /api/admin/enquiries/stats
// @desc    Get enquiry statistics
router.get('/stats', protect, enquiryController.getEnquiryStats);

// @route   GET /api/admin/enquiries/export
// @desc    Export enquiries to CSV
router.get('/export', protect, enquiryController.exportEnquiries);

// @route   GET /api/admin/enquiries/:id
// @desc    Get single enquiry
router.get('/:id', protect, enquiryController.getEnquiry);

// @route   PUT /api/admin/enquiries/:id/status
// @desc    Update enquiry status
router.put('/:id/status', protect, enquiryController.updateEnquiryStatus);

// @route   POST /api/admin/enquiries/:id/notes
// @desc    Add note to enquiry
router.post('/:id/notes', protect, enquiryController.addNote);

// @route   DELETE /api/admin/enquiries/:id
// @desc    Delete enquiry
router.delete('/:id', protect, enquiryController.deleteEnquiry);

module.exports = router;