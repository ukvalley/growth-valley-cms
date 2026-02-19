// Export all middleware
const auth = require('./auth');
const validation = require('./validation');
const upload = require('./upload');
const rateLimiter = require('./rateLimiter');
const security = require('./security');

// Re-export for convenience
module.exports = {
  auth: {
    protect: auth.protect,
    optionalAuth: auth.optionalAuth,
    authorize: auth.authorize,
  },
  validation: {
    validate: validation.validate,
    validateBody: validation.validateBody,
    schemas: validation.schemas,
    // Aliases for route usage
    authSchemas: {
      login: validation.schemas.login,
      register: validation.schemas.login, // Use same schema for register
      changePassword: validation.schemas.resetPassword,
      resetPassword: validation.schemas.resetPassword,
    },
    blogSchemas: {
      create: validation.schemas.createBlog,
      update: validation.schemas.updateBlog,
    },
    caseStudySchemas: {
      create: validation.schemas.createCaseStudy,
      update: validation.schemas.createCaseStudy, // Use same schema
    },
    enquirySchemas: {
      create: validation.schemas.contactForm,
      update: validation.schemas.updateEnquiry,
    },
  },
  upload: upload.upload,
  uploadMiddleware: upload,
  rateLimiter: rateLimiter,
  security: security,
};