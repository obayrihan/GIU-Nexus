const express = require("express");
const router = express.Router();

const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobById,
  getRecommendedJobs,
  getMyJobs,
  getSavedJobs,
  toggleSaveJob,
  applyToJob,
  getApplicants
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/auth");


router.get("/", getJobs);

router.get("/recommended", protect, authorize("jobSeeker"), getRecommendedJobs);

router.get("/my-jobs", protect, authorize("recruiter"), getMyJobs);

router.get("/saved", protect, authorize("jobSeeker"), getSavedJobs);

router.post("/", protect, authorize("recruiter", "admin"), createJob);

router.post("/:jobId/apply", protect, authorize("jobSeeker"), applyToJob);

router.get("/:jobId/applicants", protect, authorize("recruiter"), getApplicants);

router.post("/:id/save", protect, authorize("jobSeeker"), toggleSaveJob);

router.get("/:id", getJobById);

router.patch("/:id", protect, authorize("recruiter", "admin"), updateJob);

router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

module.exports = router;
