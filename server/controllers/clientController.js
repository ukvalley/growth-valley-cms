const Client = require('../models/Client');

// @desc    Get all active clients
// @route   GET /api/clients
// @access  Public
const getClients = async (req, res) => {
  try {
    const { featured, status } = req.query;
    
    let query = {};
    
    // Public endpoint - only show active
    if (!req.admin) {
      query.status = 'active';
    } else if (status) {
      query.status = status;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const clients = await Client.find(query).sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients'
    });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Public
const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client'
    });
  }
};

// @desc    Create client
// @route   POST /api/clients
// @access  Private (Admin)
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Admin)
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update client'
    });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete client'
    });
  }
};

// @desc    Reorder clients
// @route   PUT /api/clients/reorder
// @access  Private (Admin)
const reorderClients = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    
    const updates = orders.map(({ id, order }) => 
      Client.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updates);
    
    res.json({
      success: true,
      message: 'Clients reordered successfully'
    });
  } catch (error) {
    console.error('Reorder clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder clients'
    });
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  reorderClients
};