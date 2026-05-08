const express = require("express");
const router = express.Router();

const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobById,
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/auth");

// ✅ GET ALL JOBS
router.get("/", getJobs);

// ✅ GET JOB BY ID
router.get("/:id", getJobById);

// ✅ CREATE JOB
router.post("/", protect, authorize("recruiter"), createJob);

// ✅ UPDATE JOB
router.patch("/:id", protect, authorize("recruiter"), updateJob);

// ✅ DELETE JOB
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

module.exports = router;


