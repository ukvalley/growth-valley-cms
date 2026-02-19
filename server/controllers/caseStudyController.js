const { CaseStudy } = require('../models');
const { parsePagination, buildSearchFilter, generateSlug, generateUniqueSlug } = require('../services/utils');

/**
 * @desc    Get all case studies (public)
 * @route   GET /api/case-studies
 * @access  Public
 */
const getCaseStudies = async (req, res) => {
  try {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(req.query, {
      sortBy: 'publishDate',
      limit: 10
    });
    
    // Build filter
    const filter = { status: 'published', publishDate: { $lte: new Date() } };
    
    if (search) {
      Object.assign(filter, buildSearchFilter(search, ['title', 'clientName', 'industry']));
    }
    
    if (req.query.industry) {
      filter.industry = req.query.industry;
    }
    
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }
    
    // Get case studies
    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      CaseStudy.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: caseStudies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get case studies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies'
    });
  }
};

/**
 * @desc    Get featured case studies
 * @route   GET /api/case-studies/featured
 * @access  Public
 */
const getFeaturedCaseStudies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    
    const caseStudies = await CaseStudy.findFeatured().limit(limit);
    
    res.json({
      success: true,
      data: caseStudies
    });
  } catch (error) {
    console.error('Get featured case studies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured case studies'
    });
  }
};

/**
 * @desc    Get single case study by slug (public)
 * @route   GET /api/case-studies/:slug
 * @access  Public
 */
const getCaseStudyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const caseStudy = await CaseStudy.findOne({ slug, status: 'published' });
    
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }
    
    // Increment view count
    await CaseStudy.findByIdAndUpdate(caseStudy._id, { $inc: { viewCount: 1 } });
    
    res.json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    console.error('Get case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study'
    });
  }
};

/**
 * @desc    Get all case studies (admin)
 * @route   GET /api/admin/case-studies
 * @access  Private
 */
const getAdminCaseStudies = async (req, res) => {
  try {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(req.query, {
      sortBy: 'createdAt'
    });
    
    // Build filter
    const filter = {};
    
    if (search) {
      Object.assign(filter, buildSearchFilter(search, ['title', 'slug', 'clientName', 'industry']));
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.industry) {
      filter.industry = req.query.industry;
    }
    
    // Get case studies
    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      CaseStudy.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: caseStudies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin case studies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies'
    });
  }
};

/**
 * @desc    Get single case study by ID (admin)
 * @route   GET /api/admin/case-studies/:id
 * @access  Private
 */
const getAdminCaseStudyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const caseStudy = await CaseStudy.findById(id);
    
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }
    
    res.json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    console.error('Get admin case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study'
    });
  }
};

/**
 * @desc    Create case study
 * @route   POST /api/admin/case-studies
 * @access  Private
 */
const createCaseStudy = async (req, res) => {
  try {
    const { title, slug, ...rest } = req.body;
    
    // Generate or validate slug
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = await generateUniqueSlug(
        generateSlug(title),
        async (s) => !!(await CaseStudy.exists({ slug: s }))
      );
    } else {
      // Check if slug exists
      const existing = await CaseStudy.exists({ slug: finalSlug });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A case study with this slug already exists'
        });
      }
    }
    
    const caseStudy = await CaseStudy.create({
      title,
      slug: finalSlug,
      ...rest
    });
    
    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: caseStudy
    });
  } catch (error) {
    console.error('Create case study error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A case study with this slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create case study'
    });
  }
};

/**
 * @desc    Update case study
 * @route   PUT /api/admin/case-studies/:id
 * @access  Private
 */
const updateCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, ...updates } = req.body;
    
    const caseStudy = await CaseStudy.findById(id);
    
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }
    
    // Check slug uniqueness if changing
    if (slug && slug !== caseStudy.slug) {
      const existing = await CaseStudy.exists({ slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A case study with this slug already exists'
        });
      }
      caseStudy.slug = slug;
    }
    
    // Update fields
    Object.keys(updates).forEach(key => {
      caseStudy[key] = updates[key];
    });
    
    await caseStudy.save();
    
    res.json({
      success: true,
      message: 'Case study updated successfully',
      data: caseStudy
    });
  } catch (error) {
    console.error('Update case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case study'
    });
  }
};

/**
 * @desc    Delete case study
 * @route   DELETE /api/admin/case-studies/:id
 * @access  Private (admin only)
 */
const deleteCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const caseStudy = await CaseStudy.findByIdAndDelete(id);
    
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Case study deleted successfully'
    });
  } catch (error) {
    console.error('Delete case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete case study'
    });
  }
};

/**
 * @desc    Get industries list
 * @route   GET /api/case-studies/industries
 * @access  Public
 */
const getIndustries = async (req, res) => {
  try {
    const industries = await CaseStudy.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: industries.map(i => ({ name: i._id, count: i.count }))
    });
  } catch (error) {
    console.error('Get industries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch industries'
    });
  }
};

module.exports = {
  getCaseStudies,
  getFeaturedCaseStudies,
  getCaseStudyBySlug,
  getAdminCaseStudies,
  getAdminCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getIndustries
};