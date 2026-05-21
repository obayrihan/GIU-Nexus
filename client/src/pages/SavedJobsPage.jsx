import { useState, useEffect } from 'react';
import api from '../services/api';
import SaveJobButton from '../components/SaveJobButton';
import Spinner from '../components/Spinner';

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/jobs/saved');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setJobs(prev => prev.filter(job => job._id !== jobId));
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Saved Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No saved jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white border rounded-2xl p-6">
              <h3 className="font-semibold text-xl">{job.title}</h3>
              <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>

              <div className="mt-6">
                <SaveJobButton 
                  jobId={job._id} 
                  isInitiallySaved={true} 
                  onToggle={handleUnsave} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
