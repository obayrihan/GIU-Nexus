applicationSchema.index({ user: 1, job: 1 }, { unique: true });
module.exports = mongoose.model('Application', applicationSchema);
