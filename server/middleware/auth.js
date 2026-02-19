const jwt = require('jsonwebtoken');
const { Admin, RefreshToken } = require('../models');
const config = require('../config');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Find admin
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
    }
    
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated.'
      });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    next(error);
  }
};

/**
 * Optional auth - attach admin if token present, but don't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const admin = await Admin.findById(decoded.id);
      
      if (admin && admin.isActive) {
        req.admin = admin;
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without auth
    next();
  }
};

/**
 * Authorize by role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

/**
 * Generate tokens
 */
const generateTokens = async (admin) => {
  // Access token
  const accessToken = jwt.sign(
    { id: admin._id, role: admin.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
  
  // Refresh token
  const refreshTokenValue = RefreshToken.generateToken();
  const expiresAt = new Date(Date.now() + parseTimeString(config.jwtRefreshExpiresIn));
  
  await RefreshToken.create({
    token: refreshTokenValue,
    admin: admin._id,
    expiresAt
  });
  
  return {
    accessToken,
    refreshToken: refreshTokenValue,
    expiresIn: config.jwtExpiresIn
  };
};

/**
 * Parse time string like '7d', '30d', '24h' to milliseconds
 */
function parseTimeString(str) {
  const unit = str.slice(-1);
  const value = parseInt(str.slice(0, -1));
  
  switch(unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    default: return value;
  }
}

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (token) => {
  const storedToken = await RefreshToken.findOne({ token }).populate('admin');
  
  if (!storedToken) {
    return null;
  }
  
  if (storedToken.expiresAt < new Date()) {
    await storedToken.deleteOne();
    return null;
  }
  
  if (!storedToken.admin || !storedToken.admin.isActive) {
    await storedToken.deleteOne();
    return null;
  }
  
  return storedToken.admin;
};

/**
 * Revoke refresh token
 */
const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

/**
 * Revoke all refresh tokens for an admin
 */
const revokeAllRefreshTokens = async (adminId) => {
  await RefreshToken.deleteMany({ admin: adminId });
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
  generateTokens,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens
};