import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isPending = user?.status === "pending";

  useEffect(() => {
    const fetchMyJobs = async () => {
      if (isPending) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/jobs/my-jobs");

        const myJobs =
          res.data.jobs ||
          res.data.myJobs ||
          res.data.data ||
          res.data ||
          [];

        setJobs(Array.isArray(myJobs) ? myJobs : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [isPending]);

  if (loading) return <Spinner />;

  if (isPending) {
    return (
      <div style={styles.container}>
        <div style={styles.pendingBox}>
          <h1>Recruiter Approval Pending</h1>
          <p>
            Your recruiter account is still waiting for admin approval. You
            cannot post jobs yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>Manage your job posts and view applicants.</p>
        </div>

        <Link to="/recruiter/jobs/create" style={styles.createButton}>
          Create Job
        </Link>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {!error && jobs.length === 0 && (
        <div style={styles.emptyBox}>
          <h3>No jobs posted yet</h3>
          <p>Create your first job post to start receiving applicants.</p>
        </div>
      )}

      <div style={styles.grid}>
        {jobs.map((job) => (
          <div key={job._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>{job.title}</h3>

              {job.category && (
                <span style={styles.category}>{job.category}</span>
              )}
            </div>

            <p style={styles.company}>{job.company}</p>
            <p style={styles.meta}>
              {job.location} {job.type && `• ${job.type}`}
            </p>

            <p style={styles.count}>
              Applicants: {job.applicantCount ?? job.applicantsCount ?? 0}
            </p>

            <div style={styles.actions}>
              <Link to={`/recruiter/jobs/${job._id}/edit`} style={styles.link}>
                Edit
              </Link>

              <Link
                to={`/recruiter/applicants/${job._id}`}
                style={styles.link}
              >
                View Applicants
              </Link>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    marginBottom: "24px",
  },
  createButton: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  category: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    height: "fit-content",
  },
  company: {
    color: "#4b5563",
  },
  meta: {
    color: "#6b7280",
    fontSize: "14px",
  },
  count: {
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "14px",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    maxWidth: "520px",
  },
  pendingBox: {
    backgroundColor: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#9a3412",
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "620px",
  },
  error: {
    color: "#dc2626",
  },
};

export default RecruiterDashboard;
