
const JobPost = require("../models/jobpost");


exports.createJob = async (req, res) => {
  try {
    const job = await JobPost.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 🔒 check owner
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);

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

        message: "Job not found",
      });
    }

    // 🔒 check owner
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

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
