const Application = require('../models/Application');

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Already applied to this job',
      });
    }

    const application = await Application.create({
      applicant: req.user._id,
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
