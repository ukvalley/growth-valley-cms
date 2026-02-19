const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP + user agent for more accurate limiting
  keyGenerator: (req) => {
    return req.ip + ':' + (req.get('user-agent') || '');
  }
});

/**
 * Strict rate limiter for contact form
 */
const contactLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.contactMax,
  message: {
    success: false,
    message: 'Too many submissions. Please wait before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  // Use IP + email for more granular limiting
  keyGenerator: (req) => {
    return 'contact:' + req.ip + ':' + (req.body.email || '');
  }
});

/**
 * Login rate limiter - prevents brute force
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Reset on successful login
  keyGenerator: (req) => {
    return 'login:' + req.ip + ':' + (req.body.email || '');
  }
});

/**
 * Password reset rate limiter
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return 'reset:' + req.ip + ':' + (req.body.email || '');
  }
});

/**
 * Upload rate limiter
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    message: 'Upload limit reached. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Create custom rate limiter
 */
const createLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    max: options.max || config.rateLimit.maxRequests,
    message: options.message || {
      success: false,
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
};

module.exports = {
  apiLimiter,
  contactLimiter,
  loginLimiter,
  passwordResetLimiter,
  uploadLimiter,
  createLimiter
};