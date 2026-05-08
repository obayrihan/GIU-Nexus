const express = require('express');
const router = express.Router();
const express = require('express');
const router  = express.Router();

const { getAdminStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const userController = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

router.patch('/:id/status', protect, authorize('admin'), userController.updateUserStatus);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);



router.get('/stats', protect, authorize('admin'), getAdminStats);

module.exports = router;