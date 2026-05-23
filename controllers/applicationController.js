const Application = require('../models/Application');

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

const existingApplication = await Application.findOne({
  user: req.user._id,
  job: jobId,
});

const application = await Application.create({
  user: req.user._id,
  job: jobId,
});

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    })
      .populate('job')
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
