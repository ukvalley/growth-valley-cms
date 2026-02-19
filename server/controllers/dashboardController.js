const { Blog, CaseStudy, Enquiry, Media } = require('../models');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const [
      totalBlogs,
      publishedBlogs,
      totalCaseStudies,
      publishedCaseStudies,
      totalEnquiries,
      newEnquiries,
      totalMedia,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      CaseStudy.countDocuments(),
      CaseStudy.countDocuments({ status: 'published' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Media.countDocuments(),
    ]);

    // Get recent enquiries
    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email company status createdAt');

    // Get recent content
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt')
      .populate('author', 'name');

    const recentCaseStudies = await CaseStudy.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title industry status createdAt');

    // Get enquiry status breakdown
    const enquiryStatusCounts = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get blog counts by category
    const blogCategoryCounts = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          blogs: { total: totalBlogs, published: publishedBlogs },
          caseStudies: { total: totalCaseStudies, published: publishedCaseStudies },
          enquiries: { total: totalEnquiries, new: newEnquiries },
          media: totalMedia,
        },
        recent: {
          enquiries: recentEnquiries,
          blogs: recentBlogs,
          caseStudies: recentCaseStudies,
        },
        breakdown: {
          enquiriesByStatus: enquiryStatusCounts,
          blogsByCategory: blogCategoryCounts,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
};

// @desc    Get activity log
// @route   GET /api/admin/dashboard/activity
// @access  Private (Admin)
exports.getActivityLog = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent activities from different collections
    const [blogs, caseStudies, enquiries] = await Promise.all([
      Blog.find()
        .sort({ updatedAt: -1 })
        .limit(parseInt(limit))
        .select('title status updatedAt')
        .populate('author', 'name'),
      CaseStudy.find()
        .sort({ updatedAt: -1 })
        .limit(parseInt(limit))
        .select('title industry status updatedAt'),
      Enquiry.find()
        .sort({ updatedAt: -1 })
        .limit(parseInt(limit))
        .select('name company status updatedAt'),
    ]);

    // Combine and sort by date
    const activities = [
      ...blogs.map((b) => ({
        type: 'blog',
        action: b.status === 'published' ? 'published' : 'updated',
        title: b.title,
        by: b.author?.name || 'Unknown',
        date: b.updatedAt,
      })),
      ...caseStudies.map((c) => ({
        type: 'caseStudy',
        action: c.status === 'published' ? 'published' : 'updated',
        title: c.title,
        date: c.updatedAt,
      })),
      ...enquiries.map((e) => ({
        type: 'enquiry',
        action: 'updated',
        title: `${e.name} from ${e.company}`,
        date: e.updatedAt,
      })),
    ];

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: activities.slice(0, parseInt(limit)),
    });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity log',
    });
  }
};