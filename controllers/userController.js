exports.getUserProfile = async (req, res) => {
    try {
        res.json({ message: 'Get user profile' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        res.json({ message: 'Update user profile' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};