const Content = require('../models/Content');

/**
 * Convert Map to plain object recursively
 * Ensures proper serialization of MongoDB Map types
 */
function mapToObject(obj) {
  if (!obj) return obj;
  if (obj instanceof Map) {
    const result = {};
    for (const [key, value] of obj) {
      result[key] = mapToObject(value);
    }
    return result;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => mapToObject(item));
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = mapToObject(obj[key]);
    }
    return result;
  }
  return obj;
}

/**
 * Helper function to sanitize sections data
 * Ensures arrays that should contain primitives don't contain objects
 * Recursively processes nested objects and arrays
 */
function sanitizeSections(sections) {
  if (!sections || typeof sections !== 'object') return sections;

  // Handle Map type (used by mongoose for sections)
  if (sections instanceof Map) {
    const result = new Map();
    for (const [key, value] of sections) {
      result.set(key, sanitizeValue(value));
    }
    return result;
  }

  // Handle plain object
  const result = {};
  for (const key of Object.keys(sections)) {
    result[key] = sanitizeValue(sections[key]);
  }
  return result;
}

/**
 * Sanitize a single value - converts objects in primitive arrays to strings
 */
// function sanitizeValue1(value) {
//   if (Array.isArray(value)) {
//     // Check if this looks like it should be a primitive array
//     // by checking if all non-null items are primitives, or if empty, return as-is
//     const nonNullItems = value.filter(item => item !== null && item !== undefined);

//     if (nonNullItems.length === 0) {
//       return value; // Empty or all-null array, return as-is
//     }

//     const allPrimitives = nonNullItems.every(item =>
//       typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
//     );

//     if (allPrimitives) {
//       // Already a primitive array, return as-is
//       return value;
//     }

//     // Check if this looks like it SHOULD be a primitive array
//     // by checking if some items are objects that can be stringified
//     const someAreObjects = nonNullItems.some(item => typeof item === 'object');

//     if (someAreObjects) {
//       // Try to convert objects to strings if they look like they were accidentally stored
//       // This handles cases where an object { } was stored instead of a string
//       return value.map(item => {
//         if (item === null || item === undefined) return '';
//         if (typeof item === 'string') return item;
//         if (typeof item === 'number' || typeof item === 'boolean') return String(item);
//         if (typeof item === 'object') {
//           // If object has a 'value' or 'text' property, use that
//           if (item.value !== undefined) return String(item.value);
//           if (item.text !== undefined) return String(item.text);
//           // Otherwise, return empty string to avoid [object Object]
//           return '';
//         }
//         return String(item);
//       });
//     }

//     // It's an array of objects, sanitize each object recursively
//     return value.map(item => {
//       if (item && typeof item === 'object' && !Array.isArray(item)) {
//         return sanitizeSections(item);
//       }
//       return item;
//     });
//   }

//   if (value && typeof value === 'object') {
//     return sanitizeSections(value);
//   }

//   return value;
// }


// function sanitizeValue2(value) {
//   if (Array.isArray(value)) {
//     return value.map(item => {
//       if (item && typeof item === 'object' && !Array.isArray(item)) {
//         return sanitizeSections(item);
//       }
//       return item;
//     });
//   }

//   if (value && typeof value === 'object') {
//     return sanitizeSections(value);
//   }

//   return value;
// }

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return sanitizeSections(item);
      }
      return item;
    });
  }

  // 🔥 AUTO CONVERT COMMA STRING TO ARRAY
  if (typeof value === 'string' && value.includes(',')) {
    return value.split(',').map(item => item.trim());
  }

  if (value && typeof value === 'object') {
    return sanitizeSections(value);
  }

  return value;
}

/**
 * @desc    Get all pages with their content summary
 * @route   GET /api/content
 * @access  Public (for public pages) / Private (for admin)
 */
const getAllPages = async (req, res) => {
  try {
    const pages = await Content.find({})
      // .select('page seo updatedAt')
      .sort({ page: 1 })
      .lean();

    // Get default structures for any pages not in DB
    const defaultStructures = Content.getAllDefaultStructures();
    const existingPages = pages.map(p => p.page);
    const missingPages = Object.keys(defaultStructures).filter(p => !existingPages.includes(p));

    // Add missing pages with default values
    // Filter out 'about' page - it's consolidated under 'company'
    const allPages = [
      ...pages.filter(p => p.page !== 'about').map(p => ({
        page: p.page,
        seo: p.seo,
        updatedAt: p.updatedAt,
        exists: true
      })),
      ...missingPages.filter(p => p !== 'about').map(p => ({
        page: p,
        seo: {},
        updatedAt: null,
        exists: false
      }))
    ].sort((a, b) => a.page.localeCompare(b.page));

    res.json({
      success: true,
      data: allPages
    });
  } catch (error) {
    console.error('Get all pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages'
    });
  }
};

/**
 * @desc    Get content for a specific page
 * @route   GET /api/content/:page
 * @access  Public
 */
const getPageContent = async (req, res) => {
  try {
    let { page } = req.params;
    let pageName = page.toLowerCase();

    // Page aliases for backward compatibility
    if (pageName === 'about') {
      pageName = 'company';
    }
    if (pageName === 'case-studies') {
      pageName = 'casestudies';
    }

    let content = await Content.findOne({ page: pageName }).lean();

    if (!content) {
      // Return default structure if no content exists
      const defaultStructure = Content.getDefaultStructure(pageName);
      content = {
        page: pageName,
        sections: defaultStructure,
        seo: {},
        isDefault: true
      };
    } else {
      // Convert Map to plain object for proper JSON serialization
      // Use mapToObject for robust nested Map conversion
      content.sections = mapToObject(content.sections);
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page content'
    });
  }
};

/**
 * @desc    Get specific section from a page
 * @route   GET /api/content/:page/:section
 * @access  Public
 */
const getSectionContent = async (req, res) => {
  try {
    const { page, section } = req.params;
    const pageName = page.toLowerCase();

    let content = await Content.findOne({ page: pageName }).lean();

    if (!content) {
      // Return default section if no content exists
      const defaultStructure = Content.getDefaultStructure(pageName);
      content = { sections: defaultStructure };
    } else {
      // Convert Map to plain object for proper JSON serialization
      // Use mapToObject for robust nested Map conversion
      content.sections = mapToObject(content.sections);
    }

    const sectionContent = content.sections?.[section];

    if (sectionContent === undefined) {
      return res.status(404).json({
        success: false,
        message: `Section '${section}' not found on page '${pageName}'`
      });
    }

    res.json({
      success: true,
      data: {
        page: pageName,
        section,
        content: sectionContent
      }
    });
  } catch (error) {
    console.error('Get section content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch section content'
    });
  }
};

/**
 * @desc    Update content for a page (full page or specific section)
 * @route   PUT /api/content/:page
 * @access  Private (Admin only)
 */
const updatePageContent = async (req, res) => {
  try {
    let { page } = req.params;
    let pageName = page.toLowerCase();

    // Redirect 'about' to 'company' - they share the same content
    if (pageName === 'about') {
      pageName = 'company';
    }

    const { sections, seo } = req.body;

    // Validate that at least sections or seo is provided
    if (!sections && !seo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sections or seo data to update'
      });
    }

    // Sanitize sections - ensure arrays of primitives are clean
    const sanitizedSections = sections ? sanitizeSections(sections) : undefined;

    // Build update with individual section paths to MERGE instead of REPLACE
    // This prevents data loss if some sections are missing from the request
    const updateSet = {
      page: pageName,
      updatedAt: new Date(),
      updatedBy: req.admin?._id
    };

    // Use individual section paths to merge sections instead of replacing entire object
    if (sanitizedSections) {
      for (const [sectionKey, sectionValue] of Object.entries(sanitizedSections)) {
        updateSet[`sections.${sectionKey}`] = sectionValue;
      }
    }
    if (seo) updateSet.seo = seo;

    let content = await Content.findOneAndUpdate(
      { page: pageName },
      { $set: updateSet },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    ).lean();

    // Convert Map to plain object for proper JSON serialization
    // Use mapToObject for robust nested Map conversion
    if (content) {
      content.sections = mapToObject(content.sections);
    }

    res.json({
      success: true,
      message: 'Page content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Update page content error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update page content'
    });
  }
};

/**
 * @desc    Update a specific section on a page
 * @route   PUT /api/content/:page/:section
 * @access  Private (Admin only)
 */
const updateSectionContent = async (req, res) => {
  try {
    const { page, section } = req.params;
    const sectionData = req.body;
    const pageName = page.toLowerCase();

    // Sanitize section data
    const sanitizedData = sanitizeValue(sectionData);

    // Build update object
    let content = await Content.findOneAndUpdate(
      { page: pageName },
      {
        $set: {
          [`sections.${section}`]: sanitizedData,
          updatedAt: new Date(),
          updatedBy: req.admin?._id
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    // Convert Map to plain object for proper JSON serialization
    // Use mapToObject for robust nested Map conversion
    if (content) {
      content.sections = mapToObject(content.sections);
    }

    res.json({
      success: true,
      message: 'Section content updated successfully',
      data: {
        page: pageName,
        section,
        content: content.sections?.[section]
      }
    });
  } catch (error) {
    console.error('Update section content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section content'
    });
  }
};

/**
 * @desc    Delete a section from a page
 * @route   DELETE /api/content/:page/:section
 * @access  Private (Admin only)
 */
const deleteSectionContent = async (req, res) => {
  try {
    const { page, section } = req.params;
    const pageName = page.toLowerCase();

    const content = await Content.findOne({ page: pageName });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: `Page '${pageName}' not found`
      });
    }

    if (!content.sections?.has(section)) {
      return res.status(404).json({
        success: false,
        message: `Section '${section}' not found on page '${pageName}'`
      });
    }

    content.sections.delete(section);
    content.updatedAt = new Date();
    content.updatedBy = req.admin?._id;
    await content.save();

    res.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Delete section content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete section content'
    });
  }
};

/**
 * @desc    Reset page content to defaults
 * @route   POST /api/content/:page/reset
 * @access  Private (Admin only)
 */
const resetPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const pageName = page.toLowerCase();

    const defaultStructure = Content.getDefaultStructure(pageName);

    if (Object.keys(defaultStructure).length === 0) {
      return res.status(400).json({
        success: false,
        message: `No default structure available for page '${pageName}'`
      });
    }

    let content = await Content.findOneAndUpdate(
      { page: pageName },
      {
        $set: {
          sections: defaultStructure,
          seo: {},
          updatedAt: new Date(),
          updatedBy: req.admin?._id
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    // Convert Map to plain object for proper JSON serialization
    // Use mapToObject for robust nested Map conversion
    if (content) {
      content.sections = mapToObject(content.sections);
    }

    res.json({
      success: true,
      message: 'Page content reset to defaults',
      data: content
    });
  } catch (error) {
    console.error('Reset page content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset page content'
    });
  }
};

/**
 * @desc    Update SEO for a page
 * @route   PUT /api/content/:page/seo
 * @access  Private (Admin only)
 */
const updateSEO = async (req, res) => {
  try {
    const { page } = req.params;
    const seoData = req.body;
    const pageName = page.toLowerCase();

    const content = await Content.findOneAndUpdate(
      { page: pageName },
      {
        $set: {
          seo: seoData,
          updatedAt: new Date(),
          updatedBy: req.admin?._id
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    res.json({
      success: true,
      message: 'SEO updated successfully',
      data: content.seo
    });
  } catch (error) {
    console.error('Update SEO error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SEO'
    });
  }
};

/**
 * @desc    Initialize default content for all pages
 * @route   POST /api/content/initialize
 * @access  Private (Admin only)
 */
const initializeDefaults = async (req, res) => {
  try {
    const results = await Content.initializeDefaults(req.admin._id);

    res.json({
      success: true,
      message: `Initialized ${results.length} pages with default content`,
      data: {
        count: results.length,
        pages: results.map(r => r.page)
      }
    });
  } catch (error) {
    console.error('Initialize defaults error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize default content'
    });
  }
};

/**
 * @desc    Get content structure/schema for a page
 * @route   GET /api/content/:page/structure
 * @access  Public (for admin to see structure)
 */
const getPageStructure = async (req, res) => {
  try {
    const { page } = req.params;
    const pageName = page.toLowerCase();

    const defaultStructure = Content.getDefaultStructure(pageName);

    // Build section schema info with enhanced array detection
    const sections = Object.keys(defaultStructure).map(sectionKey => {
      const sectionData = defaultStructure[sectionKey];
      const type = Array.isArray(sectionData) ? 'array' : typeof sectionData;
      const fields = type === 'array'
        ? (sectionData[0] ? Object.keys(sectionData[0]) : [])
        : (sectionData && typeof sectionData === 'object' ? Object.keys(sectionData) : []);

      // Check if this is a primitive array (array of strings/numbers)
      const isPrimitiveArray = type === 'array' && (
        sectionData.length === 0 ||
        sectionData.every(item => typeof item === 'string' || typeof item === 'number')
      );

      // For objects, check each field for primitive arrays
      let fieldArrayTypes = {};
      if (type !== 'array' && sectionData && typeof sectionData === 'object') {
        for (const field of Object.keys(sectionData)) {
          const fieldValue = sectionData[field];
          if (Array.isArray(fieldValue)) {
            fieldArrayTypes[field] = {
              isPrimitive: fieldValue.length === 0 ||
                fieldValue.every(item => typeof item === 'string' || typeof item === 'number')
            };
          }
        }
      }

      return {
        name: sectionKey,
        type,
        fields,
        isArray: type === 'array',
        isPrimitiveArray,
        fieldArrayTypes
      };
    });

    res.json({
      success: true,
      data: {
        page: pageName,
        sections
      }
    });
  } catch (error) {
    console.error('Get page structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page structure'
    });
  }
};

const deleteContentByPage = async (req, res) => {
  try {
    const { page } = req.params;

    await Content.deleteOne({ page });

    res.json({
      success: true,
      message: `${page} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  getAllPages,
  getPageContent,
  getSectionContent,
  updatePageContent,
  updateSectionContent,
  deleteSectionContent,
  resetPageContent,
  updateSEO,
  initializeDefaults,
  getPageStructure,
  deleteContentByPage
};