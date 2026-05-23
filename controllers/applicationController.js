const Application = require("../models/application");
const JobPost = require("../models/jobpost");

exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Job seekers only." });
    }

    const { jobId, coverLetter } = req.body;
    const job = await JobPost.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.status !== "open") {
      return res.status(400).json({ success: false, message: "Cannot apply to a closed job" });
    }

    const existingApplication = await Application.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You already applied to this job" });
    }

    const application = await Application.create({
      user: req.user._id,
      job: jobId,
      coverLetter,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Job seekers only." });
    }

    const applications = await Application.find({ user: req.user._id })
      .populate("job")
      .populate("user", "name email skills")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!["recruiter", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Recruiters or admins only." });
    }

    const { status } = req.body;
    if (!["pending", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (req.user.role !== "admin" && application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .populate("job")
      .populate("user", "name email skills role")
      .sort({ appliedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
