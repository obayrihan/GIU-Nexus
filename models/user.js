skills: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ['jobSeeker', 'recruiter', 'admin'],
    default: 'jobSeeker'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('User', userSchema);
