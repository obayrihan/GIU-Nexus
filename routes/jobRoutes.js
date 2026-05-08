const express = require("express");
const router = express.Router();

const {

  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

  getJobs,
  getJobById,
} = require('../controllers/jobController');

// Your routes
router.get('/', getJobs);
router.get('/:id', getJobById);



const { protect, authorize } = require("../middleware/auth");


// ✅ CREATE JOB
router.post("/", protect, authorize("recruiter"), createJob);

// ✅ UPDATE JOB
router.patch("/:id", protect, authorize("recruiter"), updateJob);

// ✅ DELETE JOB
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

module.exports = router;
=======
router.get('/jobs/recommended', protect, jobController.getRecommendedJobs);
router.get('/jobs/my-jobs', protect, jobController.getMyJobs);
router.get('/jobs/saved', protect, jobController.getSavedJobs);
router.post('/jobs/:id/save', protect, jobController.toggleSaveJob);

module.exports = router;


