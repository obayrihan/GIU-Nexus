const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAdminStats
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

// All routes below require admin access
router.use(protect, authorize('admin'));

// Admin stats
router.get('/stats', getAdminStats);

// Users CRUD
router.post('/', createUser);

router.get('/', getUsers);

router.get('/:id', getUserById);

router.patch('/:id/status', updateUserStatus);

router.delete('/:id', deleteUser);

module.exports = router;
