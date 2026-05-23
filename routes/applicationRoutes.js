const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getApplications,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { authorize, protect } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), getApplications);
router.post("/", protect, authorize("jobSeeker"), applyToJob);
router.get("/my", protect, authorize("jobSeeker"), getMyApplications);
router.get("/my-applications", protect, authorize("jobSeeker"), getMyApplications);
router.patch("/:id/status", protect, authorize("recruiter", "admin"), updateApplicationStatus);

module.exports = router;
