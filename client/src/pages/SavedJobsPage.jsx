import { useEffect, useState } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";
import JobCard from "../components/JobCard";
import SaveJobButton from "../components/SaveJobButton";

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/jobs/saved");

        const savedJobs =
          res.data.jobs ||
          res.data.savedJobs ||
          res.data.data ||
          res.data ||
          [];

        setJobs(Array.isArray(savedJobs) ? savedJobs : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const removeFromList = (jobId) => {
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  if (loading) return <Spinner />;

  return (
    <div style={styles.container}>
      <h1>Saved Jobs</h1>
      <p>Jobs you bookmarked for later.</p>

      {error && <p style={styles.error}>{error}</p>}

      {!error && jobs.length === 0 && (
        <div style={styles.emptyBox}>
          <h3>No saved jobs</h3>
          <p>Save jobs from the job listings page to see them here.</p>
        </div>
      )}

      <div style={styles.grid}>
        {jobs.map((job) => (
          <div key={job._id} style={styles.cardWrapper}>
            <JobCard job={job} />

            <div style={styles.actions}>
              <SaveJobButton
                jobId={job._id}
                initiallySaved={true}
                disabled={job.status && job.status !== "open"}
              />

              <button
                type="button"
                onClick={() => removeFromList(job._id)}
                style={styles.removeButton}
              >
                Hide from list
              </button>
            </div>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "24px",
  },
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: "12px",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  removeButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#6b7280",
    cursor: "pointer",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    maxWidth: "520px",
    marginTop: "20px",
  },
  error: {
    color: "#dc2626",
  },
};

export default SavedJobsPage;
