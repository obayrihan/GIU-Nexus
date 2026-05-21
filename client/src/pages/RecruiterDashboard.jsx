import { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Recruiter Dashboard</h1>
        <a 
          href="/jobs/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          + Post New Job
        </a>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">You haven't posted any jobs yet.</p>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white border rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company} • {job.location}</p>
                <span className={`inline-block mt-2 px-4 py-1 text-sm rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                  {job.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-4">
                <a href={`/jobs/${job._id}/applicants`} className="text-blue-600 hover:underline">
                  Applicants
                </a>
                <a href={`/jobs/edit/${job._id}`} className="text-amber-600 hover:underline">
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
