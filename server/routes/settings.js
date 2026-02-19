const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// Public route
// @route   GET /api/settings
// @desc    Get site settings (public - limited fields)
router.get('/', settingsController.getSettings);

// Protected routes - admin only
// @route   PUT /api/admin/settings
// @desc    Update site settings
router.put('/', protect, settingsController.updateSettings);

// @route   POST /api/admin/settings/reset
// @desc    Reset settings to default
router.post('/reset', protect, settingsController.resetSettings);

module.exports = router;