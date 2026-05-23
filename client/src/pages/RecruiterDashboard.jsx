import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/api";

function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data } = await jobService.getMyJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="page-stack">
      <section className="page-title split-row">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>Manage your job posts and applicants.</p>
        </div>
        {user?.status === "approved" && <Link className="button-link" to="/recruiter/jobs/create">Create job</Link>}
      </section>

      {user?.status === "pending" && (
        <p className="form-alert form-alert-error">Your account is pending admin approval. You cannot post jobs yet.</p>
      )}

      {loading ? (
        <Spinner label="Loading recruiter jobs" />
      ) : error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : jobs.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Applicants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.status}</td>
                  <td>{job.applicantCount || job.applicationCount || 0}</td>
                  <td className="table-actions">
                    <Link to={`/recruiter/jobs/${job._id}/edit`}>Edit</Link>
                    <Link to={`/recruiter/applicants/${job._id}`}>Applicants</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="You have not created any jobs yet." />
      )}
    </div>
  );
}

export default RecruiterDashboard;
