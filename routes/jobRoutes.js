const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getJobs);

router.get('/jobs/recommended', protect, jobController.getRecommendedJobs);
router.get('/jobs/my-jobs', protect, jobController.getMyJobs);
router.get('/jobs/saved', protect, jobController.getSavedJobs);
router.post('/jobs/:id/save', protect, jobController.toggleSaveJob);

module.exports = router;

