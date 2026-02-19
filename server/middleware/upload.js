const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', config.upload.dir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subfolder based on mimetype
    let subfolder = 'general';
    if (file.mimetype.startsWith('image/')) {
      subfolder = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      subfolder = 'videos';
    } else if (file.mimetype.includes('pdf')) {
      subfolder = 'documents';
    }
    
    const dest = path.join(uploadDir, subfolder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check allowed file types
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${config.upload.allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${config.upload.maxSize / 1024 / 1024}MB`
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Single file upload
const uploadSingle = (fieldName) => {
  return [upload.single(fieldName), handleUploadError];
};

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 10) => {
  return [upload.array(fieldName, maxCount), handleUploadError];
};

// Mixed fields upload
const uploadFields = (fields) => {
  return [upload.fields(fields), handleUploadError];
};

// Delete file helper
const deleteFile = async (fileUrl) => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/uploads/');
    if (urlParts.length < 2) return;
    
    const filePath = path.join(uploadDir, urlParts[1]);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get file URL
const getFileUrl = (req, filePath) => {
  const relativePath = path.relative(uploadDir, filePath);
  return `/uploads/${relativePath.replace(/\\/g, '/')}`;
};

// Get full file URL
const getFullFileUrl = (req, filePath) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}${getFileUrl(req, filePath)}`;
};

// Image dimensions helper (using sharp if needed)
const getImageDimensions = async (filePath) => {
  // For now, return null - can implement with sharp package
  return { width: null, height: null };
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
  deleteFile,
  getFileUrl,
  getFullFileUrl,
  getImageDimensions,
  uploadDir
};