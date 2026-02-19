/**
 * Growth Valley CMS Backend API
 * Node.js + Express + MongoDB
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiter');
const config = require('./config');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? [config.frontendUrl, /\.growthvalley\.(in|com)$/]
    : config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, config.upload.dir)));

// Apply rate limiting to all routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '2.0.0'
  });
});

// API routes
app.use('/api/admin', routes.admin);
app.use('/api/blog', routes.blog);
app.use('/api/case-studies', routes.caseStudies);
app.use('/api/content', routes.content);
app.use('/api/contact', routes.enquiries);
app.use('/api/settings', routes.settings);
app.use('/api/seo', routes.seo);
app.use('/api/media', routes.media);
app.use('/api/team', routes.team);
app.use('/api/testimonials', routes.testimonials);

// Legacy routes for backwards compatibility
app.use('/api/enquiries', routes.enquiries);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

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

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Server Error' : err.message
  });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Growth Valley CMS API Server                          ║
║                                                            ║
║   Port: ${PORT}                                              ║
║   Environment: ${config.nodeEnv}                              ║
║   MongoDB: ${(config.mongodbUri ? config.mongodbUri.split('@')[1] || 'Local' : 'Not configured').padEnd(30)}  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

📡 API Endpoints:
   Auth:
   ├── POST   /api/admin/login
   ├── POST   /api/admin/register
   ├── GET    /api/admin/me
   ├── PUT    /api/admin/password
   ├── POST   /api/admin/forgot-password
   ├── POST   /api/admin/reset-password
   └── POST   /api/admin/logout

   Blog:
   ├── GET    /api/blog
   ├── GET    /api/blog/:slug
   ├── POST   /api/blog (admin)
   ├── PUT    /api/blog/:id (admin)
   └── DELETE /api/blog/:id (admin)

   Case Studies:
   ├── GET    /api/case-studies
   ├── GET    /api/case-studies/:slug
   ├── POST   /api/case-studies (admin)
   ├── PUT    /api/case-studies/:id (admin)
   └── DELETE /api/case-studies/:id (admin)

   Contact/Enquiries:
   ├── POST   /api/contact
   ├── GET    /api/contact (admin)
   ├── PUT    /api/contact/:id/status (admin)
   └── GET    /api/contact/export (admin)

   Settings:
   ├── GET    /api/settings
   └── PUT    /api/settings (admin)

   SEO:
   ├── GET    /api/seo
   ├── GET    /api/seo/:page
   └── PUT    /api/seo/:page (admin)

   Media:
   ├── GET    /api/media
   ├── POST   /api/media (admin)
   ├── PUT    /api/media/:id (admin)
   └── DELETE /api/media/:id (admin)

   Dashboard:
   └── GET    /api/admin/dashboard

📚 Health Check: http://localhost:${PORT}/api/health
`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

module.exports = app;