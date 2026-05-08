
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

const User = require('../models/User');
const JobPost = require('../models/JobPost');
const Application = require('../models/Application');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users with optional filters and pagination
// @route   GET /api/v1/users
// @access  Admin only
//
// How it works:
//   1. Read optional query params: role, status, page, limit
//   2. Build a MongoDB filter object from whichever params were provided
//   3. Count total matching docs (for pagination metadata)
//   4. Fetch only the current page slice using skip + limit
//   5. Never return the password field (select('-password'))
//
// Query params (all optional, all combinable):
//   ?role=recruiter          → jobSeeker | recruiter | admin
//   ?status=pending          → pending | approved | rejected
//   ?page=2&limit=10         → defaults: page=1, limit=20
// ─────────────────────────────────────────────────────────────────────────────
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;

    // Build filter dynamically — only add a key if that query param was sent
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;

    // Count total matching documents (so client knows total pages)
    const total = await User.countDocuments(filter);

    // skip = documents to jump over before starting this page
    // Example: page=2, limit=10 → skip(10), return docs 11-20
    const users = await User.find(filter)
      .select('-password')                         // never expose hashed password
      .sort({ createdAt: -1 })                    // newest users first
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),    // total number of pages
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single user by their MongoDB _id
// @route   GET /api/v1/users/:id
// @access  Admin only
//
// How it works:
//   1. Extract :id from URL params
//   2. Query DB for that document
//   3. 404 if not found, 200 with user if found
//
// Note: if :id is not a valid ObjectId format, Mongoose throws CastError.
//   The centralised errorHandler catches it and returns 404 automatically.
// ─────────────────────────────────────────────────────────────────────────────
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a user's status (approve / reject / reset a recruiter)
// @route   PATCH /api/v1/users/:id/status
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
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
      { new: true, runValidators: true }  // new: true → return updated doc
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Permanently delete a user account
// @route   DELETE /api/v1/users/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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


// ─────────────────────────────────────────────────────────────────────────────
// @desc    Platform-wide statistics via MongoDB aggregation pipelines
// @route   GET /api/v1/admin/stats
// @access  Admin only
//
// $group  → collapses documents with the same _id value into one bucket
// $sum: 1 → counts how many documents fell into each bucket
// $lookup → like a SQL JOIN — fetches related documents from another collection
// $unwind → flattens the array produced by $lookup into a single object
// ─────────────────────────────────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    // 1. Users by role
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    const usersByRole = {};
    usersByRoleRaw.forEach((r) => (usersByRole[r._id] = r.count));

    // 2. Jobs by status
    const jobsByStatusRaw = await JobPost.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const jobsByStatus = {};
    jobsByStatusRaw.forEach((r) => (jobsByStatus[r._id] = r.count));

    // 3. Applications by status
    const appsByStatusRaw = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const appsByStatus = {};
    appsByStatusRaw.forEach((r) => (appsByStatus[r._id] = r.count));

    // 4. Top 5 jobs by application count

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
