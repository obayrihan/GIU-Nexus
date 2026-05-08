const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  extractSkills,
} = require("../controllers/profileController");

const { protect } = require("../middleware/auth");

router.get("/", protect, getProfile);

router.patch("/", protect, updateProfile);

router.post('/extract-skills', protect, extractSkills);

module.exports = router;