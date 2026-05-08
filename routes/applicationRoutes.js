const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
router.post(
  '/',
  protect,
  applicationController.applyToJob
);

router.get(
  '/my-applications',
  protect,
  applicationController.getApplications
);

module.exports = router;
