const Application = require('../models/Application');

exports.applyToJob = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Apply to job',
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
      applicant: req.user._id,
    })
      .populate('job')
      .populate('applicant', 'name email');

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
