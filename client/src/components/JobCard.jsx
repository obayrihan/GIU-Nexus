import { Link } from "react-router-dom";

const categoryColors = {
  Frontend: "#dcfce7",
  Backend: "#dbeafe",
  "AI/ML": "#f3e8ff",
  DevOps: "#ccfbf1",
  "Data Engineering": "#ffedd5",
  Other: "#e5e7eb",
};

const JobCard = ({ job }) => {
  if (!job) return null;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{job.title}</h3>

        {job.category && (
          <span
            style={{
              ...styles.category,
              backgroundColor: categoryColors[job.category] || "#e5e7eb",
            }}
          >
            {job.category}
          </span>
        )}
      </div>

      <p style={styles.company}>{job.company}</p>

      <p style={styles.meta}>
        {job.location}
        {job.type && ` • ${job.type}`}
      </p>

      {job.salary && <p style={styles.salary}>Salary: {job.salary}</p>}

      <Link to={`/jobs/${job._id}`} style={styles.link}>
        View Details
      </Link>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },
  company: {
    color: "#4b5563",
    marginBottom: "6px",
  },
  meta: {
    color: "#6b7280",
    fontSize: "14px",
  },
  salary: {
    color: "#374151",
    fontSize: "14px",
  },
  category: {
    color: "#111827",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  link: {
    display: "inline-block",
    marginTop: "12px",
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default JobCard;
