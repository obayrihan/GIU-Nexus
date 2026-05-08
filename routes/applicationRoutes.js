const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.applyToJob);

router.get(
  '/my-applications',
  applicationController.getApplications
);

module.exports = router;
