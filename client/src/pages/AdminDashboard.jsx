// client/src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ─── colour helpers ───────────────────────────────────────────────────────────
const ROLE_COLOURS = {
  jobSeeker: "#3b82f6",
  recruiter: "#8b5cf6",
  admin: "#ef4444",
};

const JOB_STATUS_COLOURS = {
  open: "#22c55e",
  closed: "#6b7280",
  draft: "#f59e0b",
};

const APP_STATUS_COLOURS = {
  pending: "#f59e0b",
  shortlisted: "#3b82f6",
  rejected: "#ef4444",
};

// ─── tiny sub-components ─────────────────────────────────────────────────────
function StatCard({ title, value, colour }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statDot, backgroundColor: colour }} />
      <div>
        <p style={styles.statLabel}>{title}</p>
        <p style={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>;
}

// ─── main component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        } else {
          setError("Failed to load dashboard stats. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={{ marginTop: 16, color: "#6b7280" }}>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={{ color: "#ef4444", fontSize: 16 }}>{error}</p>
        <button style={styles.retryBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const { usersByRole = {}, jobsByStatus = {}, appsByStatus = {}, topJobs = [] } = stats || {};

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Admin Dashboard</h1>

      {/* ── Users by Role ── */}
      <SectionTitle>👥 Users by Role</SectionTitle>
      <div style={styles.cardGrid}>
        {Object.entries(usersByRole).length === 0 ? (
          <p style={styles.empty}>No user data available.</p>
        ) : (
          Object.entries(usersByRole).map(([role, count]) => (
            <StatCard
              key={role}
              title={role.charAt(0).toUpperCase() + role.slice(1)}
              value={count}
              colour={ROLE_COLOURS[role] || "#6b7280"}
            />
          ))
        )}
      </div>

      {/* ── Jobs by Status ── */}
      <SectionTitle>💼 Jobs by Status</SectionTitle>
      <div style={styles.cardGrid}>
        {Object.entries(jobsByStatus).length === 0 ? (
          <p style={styles.empty}>No job data available.</p>
        ) : (
          Object.entries(jobsByStatus).map(([status, count]) => (
            <StatCard
              key={status}
              title={status.charAt(0).toUpperCase() + status.slice(1)}
              value={count}
              colour={JOB_STATUS_COLOURS[status] || "#6b7280"}
            />
          ))
        )}
      </div>

      {/* ── Applications by Status ── */}
      <SectionTitle>📄 Applications by Status</SectionTitle>
      <div style={styles.cardGrid}>
        {Object.entries(appsByStatus).length === 0 ? (
          <p style={styles.empty}>No application data available.</p>
        ) : (
          Object.entries(appsByStatus).map(([status, count]) => (
            <StatCard
              key={status}
              title={status.charAt(0).toUpperCase() + status.slice(1)}
              value={count}
              colour={APP_STATUS_COLOURS[status] || "#6b7280"}
            />
          ))
        )}
      </div>

      {/* ── Top Jobs Leaderboard ── */}
      <SectionTitle>🏆 Top Jobs Leaderboard</SectionTitle>
      {topJobs.length === 0 ? (
        <p style={styles.empty}>No job data available yet.</p>
      ) : (
        <div style={styles.leaderboard}>
          {topJobs.map((job, index) => (
            <div key={job._id || index} style={styles.leaderboardRow}>
              <span style={styles.rank}>#{index + 1}</span>
              <div style={styles.jobInfo}>
                <p style={styles.jobTitle}>{job.title}</p>
                <p style={styles.jobCompany}>{job.company}</p>
              </div>
              <div style={styles.applicantBadge}>
                <span>{job.applicationCount ?? job.applicants ?? 0}</span>
                <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>
                  applicants
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 28,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#374151",
    marginTop: 32,
    marginBottom: 14,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 6,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  statDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  leaderboard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  leaderboardRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 20px",
    borderBottom: "1px solid #f3f4f6",
  },
  rank: {
    fontSize: 16,
    fontWeight: 700,
    color: "#9ca3af",
    minWidth: 32,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  jobCompany: {
    margin: 0,
    fontSize: 13,
    color: "#6b7280",
  },
  applicantBadge: {
    display: "flex",
    alignItems: "baseline",
    fontSize: 18,
    fontWeight: 700,
    color: "#3b82f6",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  retryBtn: {
    marginTop: 16,
    padding: "8px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
  empty: {
    color: "#9ca3af",
    fontSize: 14,
    margin: 0,
  },
};