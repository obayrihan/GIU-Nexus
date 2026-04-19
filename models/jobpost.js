  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship'],
    required: true
  },
  salary: {
    type: Number
  },
