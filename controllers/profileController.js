const User = require('../models/User');
const hf = require('../services/hfService');

// @desc  Get logged-in user's profile
// @route GET /api/v1/profile
// @access Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update profile (name, bio, profilePicture)
// @route PATCH /api/v1/profile
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Change password while logged in
// @route PATCH /api/v1/profile/change-password
// @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

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

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

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
const extractSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.bio || user.bio.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Bio is empty. Update your profile first.',
      });
    }

    let cleanSkills = user.skills;

    try {
     const result = await hf.tokenClassification({
  model: 'dslim/bert-base-NER',
  inputs: user.bio,
});

console.log(result);

const hfSkills = result
  .filter((entity) =>
    ['B-MISC', 'I-MISC', 'B-ORG'].includes(
      entity.entity_group || entity.entity
    )
  )
  .map((entity) => entity.word.replace(/^##/, '').trim())
  .filter((word) => word.length > 1);

const knownSkills = [
  'javascript',
  'react',
  'node.js',
  'mongodb',
  'python',
  'java',
  'c++',
  'express',
  'sql',
  'html',
  'css',
  'git',
  'docker',
  'tensorflow',
  'machine learning',
  'backend',
  'frontend'
];

const bioLower = user.bio.toLowerCase();

const keywordSkills = knownSkills.filter(skill =>
  bioLower.includes(skill.toLowerCase())
);

cleanSkills = [...new Set([...hfSkills, ...keywordSkills])];


      
      user.skills = cleanSkills;
      await user.save();
    } catch (hfErr) {
      console.error('HuggingFace NER error:', hfErr.message);
    }

    res.status(200).json({
      success: true,
      skills: user.skills,
      extracted: cleanSkills,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  extractSkills,
};