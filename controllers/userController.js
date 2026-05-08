const User        = require('../models/User');
const JobPost     = require('../models/JobPost');
const Application = require('../models/Application');

// ============================================================
// OBAY / AHMED RASHAD — placeholder functions (top section)
// ============================================================

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

// ============================================================
// YOUSSEF AYMAN — PATCH status, DELETE user, GET admin stats
// ============================================================

// PATCH /api/v1/users/:id/status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ['approved', 'rejected', 'pending'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    const usersByRole = usersByRoleRaw.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    const jobsByStatusRaw = await JobPost.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const jobsByStatus = jobsByStatusRaw.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    const appsByStatusRaw = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const appsByStatus = appsByStatusRaw.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    const topJobs = await Application.aggregate([
      { $group: { _id: '$job', applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobposts',
          localField: '_id',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      { $unwind: '$jobDetails' },
      {
        $project: {
          _id: '$jobDetails._id',
          title: '$jobDetails.title',
          company: '$jobDetails.company',
          applicationCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: { usersByRole, jobsByStatus, appsByStatus, topJobs },
    });
  } catch (err) {
    next(err);
  }
};