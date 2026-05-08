const JobPost = require('../models/jobpost');
const User = require('../models/user');

exports.createJob = async (req, res) => {
  try {
    res.json({ message: 'Create job' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    res.json({ message: 'Get jobs' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'jobSeeker') {
      return res.status(403).json({ success: false, message: 'Access denied. Job seekers only.' });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.skills || user.skills.length === 0) {
      const jobs = await JobPost.find({ status: 'open' })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('createdBy', 'name');
      
      return res.json({ success: true, jobs });
    }

    const openJobs = await JobPost.find({ status: 'open' })
      .populate('createdBy', 'name');

    const jobsWithScore = openJobs.map(job => {
      const jobText = [...job.requirements, job.title, job.description].join(' ').toLowerCase();
      const matchingSkills = user.skills.filter(skill => 
        jobText.includes(skill.toLowerCase())
      ).length;

      return {
        ...job.toObject(),
        score: parseFloat((0.5 + matchingSkills * 0.1).toFixed(2))
      };
    });

    jobsWithScore.sort((a, b) => b.score - a.score);

    res.json({ success: true, jobs: jobsWithScore });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ success: false, message: 'Access denied. Recruiters only.' });
    }

    const jobs = await JobPost.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'jobSeeker') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: { path: 'createdBy', select: 'name' }
    });

    res.json({ success: true, jobs: user.savedJobs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleSaveJob = async (req, res) => {
  try {
    if (req.user.role !== 'jobSeeker') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Cannot save a closed job' });
    }

    const user = await User.findById(req.user._id);

    const isAlreadySaved = user.savedJobs.includes(job._id);

    if (isAlreadySaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== job._id.toString());
      await user.save();
      return res.json({ success: true, message: 'Job removed from saved', saved: false });
    } else {
      user.savedJobs.push(job._id);
      await user.save();
      return res.json({ success: true, message: 'Job saved successfully', saved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
