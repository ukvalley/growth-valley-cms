/**
 * Test App - Express app without server startup
 * Used for integration testing with supertest
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../routes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/admin', routes.admin);
app.use('/api/blog', routes.blog);
app.use('/api/case-studies', routes.caseStudies);
app.use('/api/clients', routes.clients);
app.use('/api/content', routes.content);
app.use('/api/contact', routes.enquiries);
app.use('/api/settings', routes.settings);
app.use('/api/seo', routes.seo);
app.use('/api/media', routes.media);
app.use('/api/team', routes.team);
app.use('/api/testimonials', routes.testimonials);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'test',
    version: '2.0.0'
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: 'Server Error'
  });
});

module.exports = app;