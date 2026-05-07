const express = require('express');
const router  = express.Router();
const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// All routes in this file require:
//   1. protect     → valid JWT in Authorization: Bearer <token> header
//   2. authorize   → user's role must be 'admin'
//
// This is applied once with router.use() so it covers every route below
// instead of repeating protect, authorize('admin') on each line.
// ─────────────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin'));

// GET  /api/v1/users           → list all users (filterable + paginated)
// GET  /api/v1/users/:id       → get one user by ID
// PATCH /api/v1/users/:id/status → approve / reject / reset a user
// DELETE /api/v1/users/:id     → permanently delete a user

router.get('/',              getUsers);
router.get('/:id',           getUserById);
router.patch('/:id/status',  updateUserStatus);
router.delete('/:id',        deleteUser);

module.exports = router;
