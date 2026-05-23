import { useCallback, useEffect, useState } from "react";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import Spinner from "../components/Spinner";
import { applicationService } from "../services/api";

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    const params = query ? { status: query } : {};
    const { data } = await applicationService.getApplications(params);
    setApplications(data.applications || []);
  }, [query]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        await loadApplications();
      } catch (err) {
        setError(err.response?.data?.message || "Could not load applications.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [loadApplications]);

  const updateStatus = async (id, nextStatus) => {
    await applicationService.updateStatus(id, nextStatus);
    await loadApplications();
  };

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Admin Applications</h1>
        <p>Approve, shortlist, reject, or reset submitted applications.</p>
      </section>

      <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); setQuery(status); }}>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Any status</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">Apply filter</button>
      </form>

      {loading ? (
        <Spinner label="Loading applications" />
      ) : error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Company</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td>{application.user?.name || "-"}</td>
                  <td>{application.job?.title || "-"}</td>
                  <td>{application.job?.company || "-"}</td>
                  <td><ApplicationStatusBadge status={application.status} /></td>
                  <td className="table-actions">
                    <button className="secondary-button" type="button" onClick={() => updateStatus(application._id, "pending")}>Pending</button>
                    <button className="secondary-button" type="button" onClick={() => updateStatus(application._id, "shortlisted")}>Approve</button>
                    <button className="danger-button" type="button" onClick={() => updateStatus(application._id, "rejected")}>Deny</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminApplicationsPage;
