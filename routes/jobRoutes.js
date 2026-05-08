const express = require("express");
const router = express.Router();

const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobById,
  recommendJobs
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/auth");


router.get("/", getJobs);

router.get("/recommended", protect, recommendJobs);

router.get("/:id", getJobById);

router.post("/", protect, authorize("recruiter"), createJob);

router.patch("/:id", protect, authorize("recruiter"), updateJob);

router.delete("/:id", protect, authorize("recruiter"), deleteJob);

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobById,
  recommendJobs
};

