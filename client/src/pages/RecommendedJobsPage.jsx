import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";
import JobCard from "../components/JobCard";

const RecommendedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const res = await api.get("/jobs/recommended");

        const recommendedJobs =
          res.data.jobs ||
          res.data.recommendedJobs ||
          res.data.data ||
          res.data ||
          [];

        setJobs(Array.isArray(recommendedJobs) ? recommendedJobs : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load recommended jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Recommended Jobs</h1>
        <p>Jobs ranked based on your extracted skills and profile.</p>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {!error && jobs.length === 0 && (
        <div style={styles.emptyBox}>
          <h3>No recommendations yet</h3>
          <p>
            Add a bio and extract your skills first to get personalized job
            recommendations.
          </p>
          <Link to="/profile" style={styles.link}>
            Go to Profile
          </Link>
        </div>
      )}

      <div style={styles.grid}>
        {jobs.map((job) => (
          <div key={job._id} style={styles.cardWrapper}>
            {typeof job.score === "number" && (
              <span style={styles.score}>
                Match: {Math.round(job.score * 100)}%
              </span>
            )}

            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
  },
  header: {
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  cardWrapper: {
    position: "relative",
  },
  score: {
    display: "inline-block",
    marginBottom: "8px",
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    maxWidth: "520px",
  },
  link: {
    display: "inline-block",
    marginTop: "12px",
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none",
  },
  error: {
    color: "#dc2626",
  },
};

export default RecommendedJobsPage;
