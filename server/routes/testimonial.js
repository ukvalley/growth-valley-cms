const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getTestimonial,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Admin routes
router.get('/admin/all', protect, authorize('admin', 'editor'), getAdminTestimonials);
router.post('/', protect, authorize('admin', 'editor'), createTestimonial);
router.put('/reorder', protect, authorize('admin', 'editor'), reorderTestimonials);
router.put('/:id', protect, authorize('admin', 'editor'), updateTestimonial);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteTestimonial);

module.exports = router;