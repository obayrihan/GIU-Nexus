const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Data Engineering', 'Other'],
    required: true
  },
  totalSlots: {
    type: Number,
    required: true,
    min: [1, 'Total slots must be at least 1']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('JobPost', jobPostSchema);