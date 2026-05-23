const Application = require("../models/application");
const JobPost = require("../models/jobpost");
const User = require("../models/user");

function classifyCategory(job) {
  const text = `${job.title || ""} ${job.description || ""} ${(job.requirements || []).join(" ")}`.toLowerCase();
  const categories = [
    ["Frontend", ["frontend", "react", "vue", "angular", "css", "html", "ui", "ux"]],
    ["Backend", ["backend", "node", "express", "api", "server", "database"]],
    ["AI/ML", ["ai", "ml", "machine learning", "tensorflow", "pytorch", "model", "nlp"]],
    ["DevOps", ["devops", "docker", "kubernetes", "ci/cd", "aws", "cloud"]],
    ["Data Engineering", ["data", "etl", "pipeline", "warehouse", "spark", "sql"]],
  ];

  const match = categories.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)));
  return match ? match[0] : "Other";
}

function normalizeJobBody(body) {
  const payload = { ...body };

  if (typeof payload.requirements === "string") {
    payload.requirements = payload.requirements.split(",").map((item) => item.trim()).filter(Boolean);
  }

  if (payload.salary === "") delete payload.salary;
  if (payload.totalSlots !== undefined) payload.totalSlots = Number(payload.totalSlots);

  return payload;
}

exports.createJob = async (req, res) => {
  try {
    if (req.user.role === "recruiter" && req.user.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval. Wait for admin approval before posting jobs.",
      });
    }

    const payload = normalizeJobBody(req.body);
    payload.category = classifyCategory(payload);

    const job = await JobPost.create({
      ...payload,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    if (req.user.role === "recruiter" && req.user.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval. Wait for admin approval before editing jobs.",
      });
    }

    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (req.user.role !== "admin" && job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    const payload = normalizeJobBody(req.body);
    if (payload.description || payload.title || payload.requirements) {
      payload.category = classifyCategory({ ...job.toObject(), ...payload });
    }

    const updatedJob = await JobPost.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const ownsJob = job.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !ownsJob) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await Application.deleteMany({ job: job._id });
    await User.updateMany({ savedJobs: job._id }, { $pull: { savedJobs: job._id } });
    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const { keyword, location, type, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await JobPost.countDocuments(query);
    const jobs = await JobPost.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({ success: true, total, page: Number(page), jobs });
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id).populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Access denied. Job seekers only." });
    }

    const user = await User.findById(req.user._id);
    const openJobs = await JobPost.find({ status: "open" }).populate("createdBy", "name");

    const jobs = openJobs.map((job) => {
      const jobText = `${job.title} ${job.description} ${(job.requirements || []).join(" ")}`.toLowerCase();
      const matchingSkills = (user.skills || []).filter((skill) => jobText.includes(skill.toLowerCase())).length;
      return {
        ...job.toObject(),
        score: Number((0.5 + matchingSkills * 0.1).toFixed(2)),
      };
    }).sort((a, b) => b.score - a.score);

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied. Recruiters only." });
    }

    const jobs = await JobPost.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobs.map((job) => job._id) } } },
      { $group: { _id: "$job", applicationCount: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((item) => [item._id.toString(), item.applicationCount]));
    const jobsWithCounts = jobs.map((job) => ({
      ...job.toObject(),
      applicantCount: countMap.get(job._id.toString()) || 0,
    }));

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

exports.toggleSaveJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "open") {
      return res.status(400).json({ success: false, message: "Cannot save a closed job" });
    }

    const user = await User.findById(req.user._id);
    const isAlreadySaved = user.savedJobs.some((id) => id.toString() === job._id.toString());

    if (isAlreadySaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== job._id.toString());
      await user.save();
      return res.json({ success: true, message: "Job removed from saved", saved: false });
    }

    user.savedJobs.push(job._id);
    await user.save();
    return res.json({ success: true, message: "Job saved", saved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ success: false, message: "Job seekers only." });
    }

    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "open") {
      return res.status(400).json({ success: false, message: "Cannot apply to a closed job" });
    }

    const existingApplication = await Application.findOne({ user: req.user._id, job: job._id });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You already applied to this job" });
    }

    const application = await Application.create({
      user: req.user._id,
      job: job._id,
      coverLetter: req.body.coverLetter,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Recruiters only." });
    }

    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view applicants" });
    }

    const applications = await Application.find({ job: job._id })
      .populate("user", "name email skills")
      .populate("job", "title company");

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
