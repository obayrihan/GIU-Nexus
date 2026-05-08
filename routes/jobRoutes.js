const express = require('express');
const router = express.Router();

const {
  getJobs,
  getJobById,
} = require('../controllers/jobController');

// Your routes
router.get('/', getJobs);
router.get('/:id', getJobById);

router.get('/jobs/recommended', protect, jobController.getRecommendedJobs);
router.get('/jobs/my-jobs', protect, jobController.getMyJobs);
router.get('/jobs/saved', protect, jobController.getSavedJobs);
router.post('/jobs/:id/save', protect, jobController.toggleSaveJob);

module.exports = router;

