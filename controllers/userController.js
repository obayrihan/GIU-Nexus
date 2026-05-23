const User = require('../models/user');
const JobPost = require('../models/jobpost');
const Application = require('../models/application');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res, next) => {
  try {
    let { name, email, password, role = 'jobSeeker', status = 'approved', bio, profilePicture, skills = [] } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    email = email.toLowerCase();

    if (!['jobSeeker', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      status,
      bio,
      profilePicture,
      skills: Array.isArray(skills)
        ? skills
        : String(skills).split(',').map((skill) => skill.trim()).filter(Boolean),
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        bio: user.bio,
        profilePicture: user.profilePicture,
        skills: user.skills,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// GET ALL USERS
// GET /api/v1/users
// Admin only
// ============================================================
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// GET SINGLE USER
// GET /api/v1/users/:id
// ============================================================
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// UPDATE USER STATUS
// PATCH /api/v1/users/:id/status
// ============================================================
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ['approved', 'rejected', 'pending'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// DELETE USER
// DELETE /api/v1/users/:id
// ============================================================
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// ADMIN STATS
// GET /api/v1/admin/stats
// ============================================================
exports.getAdminStats = async (req, res, next) => {
  try {

    // Users by role
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const usersByRole = {};

    usersByRoleRaw.forEach((r) => {
      usersByRole[r._id] = r.count;
    });

    // Jobs by status
    const jobsByStatusRaw = await JobPost.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const jobsByStatus = {};

    jobsByStatusRaw.forEach((r) => {
      jobsByStatus[r._id] = r.count;
    });

    // Applications by status
    const appsByStatusRaw = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const appsByStatus = {};

    appsByStatusRaw.forEach((r) => {
      appsByStatus[r._id] = r.count;
    });

    // Top jobs
    const topJobs = await Application.aggregate([
      {
        $group: {
          _id: '$job',
          applicationCount: { $sum: 1 },
        },
      },
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
      usersByRole,
      jobsByStatus,
      appsByStatus,
      topJobs,
      stats: {
        usersByRole,
        jobsByStatus,
        appsByStatus,
        topJobs,
      },
    });

  } catch (err) {
    next(err);
  }
};
