const { PageSEO } = require('../models');

// @desc    Get all page SEO settings
// @route   GET /api/seo
// @access  Public
exports.getAllPageSEO = async (req, res) => {
  try {
    const pages = await PageSEO.find({ isActive: true });

    // Transform to object keyed by page
    const seoMap = {};
    pages.forEach((page) => {
      seoMap[page.page] = {
        pageTitle: page.pageTitle,
        ...page.seo.toObject(),
      };
    });

    res.json({
      success: true,
      data: seoMap,
    });
  } catch (error) {
    console.error('Get all page SEO error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SEO settings',
    });
  }
};

// @desc    Get SEO for specific page
// @route   GET /api/seo/:page
// @access  Public
exports.getPageSEO = async (req, res) => {
  try {
    const { page } = req.params;

    const pageSEO = await PageSEO.getByPage(page);

    if (!pageSEO) {
      return res.status(404).json({
        success: false,
        error: 'SEO settings not found for this page',
      });
    }

    res.json({
      success: true,
      data: pageSEO,
    });
  } catch (error) {
    console.error('Get page SEO error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page SEO',
    });
  }
};

// @desc    Create or update page SEO
// @route   PUT /api/admin/seo/:page
// @access  Private (Admin)
exports.updatePageSEO = async (req, res) => {
  try {
    const { page } = req.params;
    const { pageTitle, seo, customFields, isActive } = req.body;

    const validPages = ['home', 'solutions', 'industries', 'case-studies', 'company', 'contact', 'blog'];
    if (!validPages.includes(page)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page identifier',
      });
    }

    const pageSEO = await PageSEO.findOneAndUpdate(
      { page },
      {
        page,
        pageTitle,
        seo,
        customFields,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'SEO settings updated successfully',
      data: pageSEO,
    });
  } catch (error) {
    console.error('Update page SEO error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update page SEO',
    });
  }
};

// @desc    Delete page SEO
// @route   DELETE /api/admin/seo/:page
// @access  Private (Admin)
exports.deletePageSEO = async (req, res) => {
  try {
    const { page } = req.params;

    const pageSEO = await PageSEO.findOneAndDelete({ page });

    if (!pageSEO) {
      return res.status(404).json({
        success: false,
        error: 'SEO settings not found for this page',
      });
    }

    res.json({
      success: true,
      message: 'SEO settings deleted successfully',
    });
  } catch (error) {
    console.error('Delete page SEO error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete page SEO',
    });
  }
};