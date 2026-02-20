const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClient);

// Protected routes (Admin only)
router.post('/', protect, clientController.createClient);
router.put('/reorder', protect, clientController.reorderClients);
router.put('/:id', protect, clientController.updateClient);
router.delete('/:id', protect, clientController.deleteClient);

module.exports = router;