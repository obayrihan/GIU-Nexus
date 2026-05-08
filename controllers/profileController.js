const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        bio,
        profilePicture,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};const User = require('../models/User');
const hf = require('../services/hfService');

// @desc  Change password while logged in
// @route PATCH /api/v1/profile/change-password
// @access Private (any logged-in user)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate both fields are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide currentPassword and newPassword',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Fetch user with password (password is excluded by default in the schema)
    const user = await User.findById(req.user._id).select('+password');

    // Check current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Set new password — the User model pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Extract skills from bio using HuggingFace NER model
// @route POST /api/v1/profile/extract-skills
// @access Job Seeker only
exports.extractSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Bio must exist before we can extract skills from it
    if (!user.bio || user.bio.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Bio is empty. Update your profile first.',
      });
    }

    let cleanSkills = user.skills; // fallback — keep existing skills if AI fails

    try {
      // Send bio text to HuggingFace NER model
      const result = await hf.tokenClassification({
        model: 'dslim/bert-base-NER',
        inputs: user.bio,
      });

      // Filter for technology and organisation entities only
      // B-MISC = beginning of misc entity (e.g. "React")
      // I-MISC = continuation (e.g. "##JS" after "React")
      // B-ORG  = organisation names (e.g. "MongoDB", "AWS")
      const extracted = result
        .filter((entity) =>
          ['B-MISC', 'I-MISC', 'B-ORG'].includes(
            entity.entity_group || entity.entity
          )
        )
        .map((entity) => entity.word.replace(/^##/, '').trim()) // clean sub-word tokens
        .filter((word) => word.length > 1); // remove single characters

      // Remove duplicates using Set
      cleanSkills = [...new Set(extracted)];

      // Save extracted skills back to user profile
      user.skills = cleanSkills;
      await user.save();
    } catch (hfErr) {
      // If HuggingFace fails, do NOT crash — just log and return existing skills
      console.error('HuggingFace NER error:', hfErr.message);
    }

    res.status(200).json({
      success: true,
      skills: user.skills,     // what is now saved on their profile
      extracted: cleanSkills,  // what the AI found this run
    });
  } catch (err) {
    next(err);
  }
};