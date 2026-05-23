import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { adminService } from "../services/api";

function StatGroup({ title, values = {} }) {
  return (
    <article className="stat-card">
      <h3>{title}</h3>
      {Object.keys(values).length ? (
        Object.entries(values).map(([key, value]) => (
          <p key={key}><span>{key}</span><strong>{value}</strong></p>
        ))
      ) : (
        <p>No data</p>
      )}
    </article>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await adminService.getStats();
        setStats(data.stats || data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load admin stats.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <Spinner label="Loading admin dashboard" />;

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Admin Dashboard</h1>
        <p>Platform-wide activity summary.</p>
      </section>
      {error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : (
        <>
          <div className="stats-grid">
            <StatGroup title="Users by Role" values={stats?.usersByRole} />
            <StatGroup title="Jobs by Status" values={stats?.jobsByStatus} />
            <StatGroup title="Applications by Status" values={stats?.appsByStatus} />
          </div>
          <section className="content-section">
            <h2>Top Jobs</h2>
            <ul className="leaderboard">
              {(stats?.topJobs || []).map((job) => (
                <li key={job._id}><span>{job.title}</span><strong>{job.applicationCount}</strong></li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
