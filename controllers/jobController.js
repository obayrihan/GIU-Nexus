
const JobPost = require("../models/jobpost");
const User = require("../models/user");

// ✅ CREATE JOB
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

// ✅ DELETE JOB
exports.deleteJob = async (req, res) => {
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
  }
};

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
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await JobPost.countDocuments(query);

    const jobs = await JobPost.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select("title company location type category status createdAt");

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
    const job = await JobPost.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
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

// ─────────────────────────────────────────
// @desc    Get recommended jobs based on skills
// @route   GET /api/v1/jobs/recommended
// @access  Private (Job Seekers)
// ─────────────────────────────────────────
exports.getRecommendedJobs = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Job seekers only.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.skills || user.skills.length === 0) {
      const jobs = await JobPost.find({ status: "open" })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("createdBy", "name");

      return res.json({ success: true, jobs });
    }

    const openJobs = await JobPost.find({ status: "open" }).populate(
      "createdBy",
      "name"
    );

    const jobsWithScore = openJobs.map((job) => {
      const jobText = [
        ...job.requirements,
        job.title,
        job.description,
      ]
        .join(" ")
        .toLowerCase();
      const matchingSkills = user.skills.filter((skill) =>
        jobText.includes(skill.toLowerCase())
      ).length;

      return {
        ...job.toObject(),
        score: parseFloat((0.5 + matchingSkills * 0.1).toFixed(2)),
      };
    });

    jobsWithScore.sort((a, b) => b.score - a.score);

    res.json({ success: true, jobs: jobsWithScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @desc    Get jobs created by recruiter
// @route   GET /api/v1/jobs/my-jobs
// @access  Private (Recruiters)
// ─────────────────────────────────────────
exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Recruiters only.",
      });
    }

    const jobs = await JobPost.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @desc    Get saved jobs by user
// @route   GET /api/v1/jobs/saved
// @access  Private (Job Seekers)
// ─────────────────────────────────────────
exports.getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      populate: { path: "createdBy", select: "name" },
    });

    res.json({ success: true, jobs: user.savedJobs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @desc    Toggle save/unsave job
// @route   POST /api/v1/jobs/:id/save
// @access  Private (Job Seekers)
// ─────────────────────────────────────────
exports.toggleSaveJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const job = await JobPost.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "open") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot save a closed job" });
    }

    const user = await User.findById(req.user._id);

    const isAlreadySaved = user.savedJobs.includes(job._id);

    if (isAlreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== job._id.toString()
      );
      await user.save();
      return res.json({
        success: true,
        message: "Job removed from saved",
        saved: false,
      });
    } else {
      user.savedJobs.push(job._id);
      await user.save();
      return res.json({
        success: true,
        message: "Job saved successfully",
        saved: true,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

