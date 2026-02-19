const Content = require('../models/Content');

/**
 * @desc    Get all pages with their content summary
 * @route   GET /api/content
 * @access  Public (for public pages) / Private (for admin)
 */
const getAllPages = async (req, res) => {
  try {
    const pages = await Content.find({})
      .select('page seo updatedAt')
      .sort({ page: 1 })
      .lean();

    // Get default structures for any pages not in DB
    const defaultStructures = Content.getAllDefaultStructures();
    const existingPages = pages.map(p => p.page);
    const missingPages = Object.keys(defaultStructures).filter(p => !existingPages.includes(p));

    // Add missing pages with default values
    const allPages = [
      ...pages.map(p => ({
        page: p.page,
        seo: p.seo,
        updatedAt: p.updatedAt,
        exists: true
      })),
      ...missingPages.map(p => ({
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
    const { page } = req.params;
    const pageName = page.toLowerCase();

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
    const { page } = req.params;
    const { sections, seo } = req.body;
    const pageName = page.toLowerCase();

    // Validate that at least sections or seo is provided
    if (!sections && !seo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sections or seo data to update'
      });
    }

    const updateData = {
      page: pageName,
      updatedAt: new Date(),
      updatedBy: req.admin?._id
    };

    if (sections) updateData.sections = sections;
    if (seo) updateData.seo = seo;

    const content = await Content.findOneAndUpdate(
      { page: pageName },
      { $set: updateData },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    ).lean();

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

    // Build update object
    const content = await Content.findOneAndUpdate(
      { page: pageName },
      {
        $set: {
          [`sections.${section}`]: sectionData,
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

    const content = await Content.findOneAndUpdate(
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

    // Build section schema info
    const sections = Object.keys(defaultStructure).map(sectionKey => {
      const sectionData = defaultStructure[sectionKey];
      const type = Array.isArray(sectionData) ? 'array' : typeof sectionData;
      const fields = type === 'array' 
        ? (sectionData[0] ? Object.keys(sectionData[0]) : [])
        : (sectionData && typeof sectionData === 'object' ? Object.keys(sectionData) : []);
      
      return {
        name: sectionKey,
        type,
        fields,
        isArray: type === 'array'
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
  getPageStructure
};