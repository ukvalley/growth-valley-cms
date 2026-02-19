const express = require('express');
const router = express.Router();
const caseStudyController = require('../controllers/caseStudyController');
const { protect } = require('../middleware/auth');
const { validation } = require('../middleware');

// Public routes
// @route   GET /api/case-studies
// @desc    Get all published case studies
router.get('/', caseStudyController.getCaseStudies);

// @route   GET /api/case-studies/featured
// @desc    Get featured case studies
router.get('/featured', caseStudyController.getFeaturedCaseStudies);

// @route   GET /api/case-studies/industries
// @desc    Get industries list
router.get('/industries', caseStudyController.getIndustries);

// @route   GET /api/case-studies/:slug
// @desc    Get single case study by slug
router.get('/:slug', caseStudyController.getCaseStudyBySlug);

// Admin routes (protected)
// @route   GET /api/case-studies/admin/all
// @desc    Get all case studies (including drafts)
router.get('/admin/all', protect, caseStudyController.getAdminCaseStudies);

// @route   GET /api/case-studies/admin/:id
// @desc    Get case study by ID
router.get('/admin/:id', protect, caseStudyController.getAdminCaseStudyById);

// @route   POST /api/case-studies
// @desc    Create new case study
router.post('/', protect, validation.validateBody(validation.schemas.createCaseStudy), caseStudyController.createCaseStudy);

// @route   PUT /api/case-studies/:id
// @desc    Update case study
router.put('/:id', protect, validation.validateBody(validation.schemas.createCaseStudy), caseStudyController.updateCaseStudy);

// @route   DELETE /api/case-studies/:id
// @desc    Delete case study
router.delete('/:id', protect, caseStudyController.deleteCaseStudy);

module.exports = router;