exports.applyToJob = async (req, res) => {
  try {
    res.json({ message: 'Apply to job' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    res.json({ message: 'Get applications' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};