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
