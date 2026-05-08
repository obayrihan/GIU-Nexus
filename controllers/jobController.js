const JobPost = require('../models/jobpost');

// ─────────────────────────────────────────
// @desc    Get all jobs (paginated + filtered)
// @route   GET /api/v1/jobs
// @access  Public
// ─────────────────────────────────────────
exports.getJobs = async (req, res, next) => {
  try {
    const { keyword, location, type, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title:       { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type)     query.type     = type;
    if (status)   query.status   = status;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await JobPost.countDocuments(query);

    const jobs = await JobPost.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('title company location type category status createdAt');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      jobs,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// @desc    Get single job by ID
// @route   GET /api/v1/jobs/:id
// @access  Public
// ─────────────────────────────────────────
exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    next(err);
  }
};