const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      required: true,
    },

    salary: {
      type: Number,
    },

    totalSlots: {
      type: Number,
      default: 1,
    },

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "AI/ML",
        "DevOps",
        "Data Engineering",
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", jobPostSchema);
