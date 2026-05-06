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