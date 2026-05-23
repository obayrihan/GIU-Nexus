import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { applicationService } from "../services/api";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const { data } = await applicationService.getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load applications.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>My Applications</h1>
        <p>Track your submitted applications.</p>
      </section>

      {loading ? (
        <Spinner label="Loading applications" />
      ) : error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : applications.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td><Link to={`/jobs/${application.job?._id}`}>{application.job?.title || "Job"}</Link></td>
                  <td>{application.job?.company || "-"}</td>
                  <td><ApplicationStatusBadge status={application.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="You have not applied to any jobs yet." action={<Link to="/jobs">Browse jobs</Link>} />
      )}
    </div>
  );
}

export default MyApplicationsPage;
