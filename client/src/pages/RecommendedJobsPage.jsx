import { useState, useEffect } from 'react';
import api from '../services/api';
import SaveJobButton from '../components/SaveJobButton';
import Spinner from '../components/Spinner';

const RecommendedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/jobs/recommended');
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError('Failed to load AI recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">AI Recommended Jobs</h1>
        <p className="text-gray-600 mt-2">Personalized based on your skills profile</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No recommendations available yet. Update your skills in profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                {job.score && (
                  <div className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {Math.round(job.score * 100)}% Match
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.requirements?.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <SaveJobButton jobId={job._id} />
                <a 
                  href={`/jobs/${job._id}`} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedJobsPage;
