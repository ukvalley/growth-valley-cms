const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');
const { uploadMiddleware } = require('../middleware');

// All media routes are protected
router.use(protect);

// @route   POST /api/admin/media
// @desc    Upload media file
router.post('/', uploadMiddleware.upload.single('file'), uploadMiddleware.handleUploadError, mediaController.uploadMedia);

// @route   GET /api/admin/media
// @desc    Get all media files
router.get('/', mediaController.getMedia);

// @route   GET /api/admin/media/stats
// @desc    Get media storage stats
router.get('/stats', mediaController.getMediaStats);

// @route   GET /api/admin/media/folders
// @desc    Get all folders
router.get('/folders', mediaController.getFolders);

// @route   GET /api/admin/media/:id
// @desc    Get media by ID
router.get('/:id', mediaController.getMediaById);

// @route   PUT /api/admin/media/:id
// @desc    Update media metadata
router.put('/:id', mediaController.updateMedia);

// @route   DELETE /api/admin/media/:id
// @desc    Delete media
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;