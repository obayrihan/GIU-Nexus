exports.register = async (req, res) => {
  try {
    res.json({ message: 'Register route' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    res.json({ message: 'Login route' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};