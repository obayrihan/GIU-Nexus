import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/api";
import { useSavedJobIds } from "../utils/savedJobs";

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [error, setError] = useState("");
  const savedJobIds = useSavedJobIds();

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data } = await jobService.getJobs({ limit: 6, status: "open" });
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "jobSeeker") {
      return;
    }

    async function loadRecommended() {
      setRecommendedLoading(true);
      try {
        const { data } = await jobService.getRecommendedJobs();
        setRecommended(data.jobs || []);
      } catch {
        setRecommended([]);
      } finally {
        setRecommendedLoading(false);
      }
    }

    loadRecommended();
  }, [isAuthenticated, user?.role]);

  return (
    <div className="page-stack">
      <section className="hero-section">
        <div>
          <h1>GIU Nexus</h1>
          <p>Discover jobs, manage applications, and connect talent with opportunity.</p>
        </div>
        <Link className="button-link" to="/jobs">
          Browse jobs
        </Link>
      </section>

      {isAuthenticated && user?.role === "jobSeeker" && (
        <section className="content-section">
          <div className="section-heading">
            <h2>Recommended for You</h2>
            <Link to="/jobs/recommended">View all</Link>
          </div>
          {recommendedLoading ? (
            <Spinner label="Loading recommendations" />
          ) : recommended.length ? (
            <div className="card-grid">
              {recommended.slice(0, 3).map((job) => (
                <JobCard key={job._id} job={{ ...job, saved: savedJobIds.has(String(job._id)) }} showScore />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recommendations yet"
              message="Add skills to your profile to improve recommendations."
              action={<Link to="/profile">Go to profile</Link>}
            />
          )}
        </section>
      )}

      <section className="content-section">
        <div className="section-heading">
          <h2>Trending Jobs</h2>
          <Link to="/jobs">View all</Link>
        </div>
        {loading ? (
          <Spinner label="Loading jobs" />
        ) : error ? (
          <p className="form-alert form-alert-error">{error}</p>
        ) : jobs.length ? (
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={{ ...job, saved: savedJobIds.has(String(job._id)) }} />
            ))}
          </div>
        ) : (
          <EmptyState message="No open jobs are available right now." />
        )}
      </section>
    </div>
  );
}

export default HomePage;
