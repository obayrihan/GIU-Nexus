import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import { jobService } from "../services/api";
import { useSavedJobIds } from "../utils/savedJobs";

function RecommendedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const savedJobIds = useSavedJobIds();

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data } = await jobService.getRecommendedJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load recommended jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Recommended Jobs</h1>
        <p>Roles ranked against your profile skills.</p>
      </section>

      {loading ? (
        <Spinner label="Loading recommendations" />
      ) : error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : jobs.length ? (
        <div className="card-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={{ ...job, saved: savedJobIds.has(String(job._id)) }} showScore />
          ))}
        </div>
      ) : (
        <EmptyState message="No recommendations yet. Extract skills from your profile bio first." />
      )}
    </div>
  );
}

export default RecommendedJobsPage;
