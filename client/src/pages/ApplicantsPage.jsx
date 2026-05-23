import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import SkillChip from "../components/SkillChip";
import Spinner from "../components/Spinner";
import { applicationService, jobService } from "../services/api";

function ApplicantsPage() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplicants() {
      try {
        const { data } = await jobService.getApplicants(jobId);
        setApplications(data.applications || data.applicants || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load applicants.");
      } finally {
        setLoading(false);
      }
    }

    loadApplicants();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    await applicationService.updateStatus(applicationId, status);
    setApplications((current) =>
      current.map((application) => application._id === applicationId ? { ...application, status } : application),
    );
  };

  if (loading) return <Spinner label="Loading applicants" />;

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Applicants</h1>
        <p>Review applicants and update their status.</p>
      </section>
      {error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Skills</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const applicant = application.user || application.applicant;
                return (
                  <tr key={application._id}>
                    <td>{applicant?.name || "-"}</td>
                    <td>{applicant?.email || "-"}</td>
                    <td><div className="chip-row compact">{(applicant?.skills || []).map((skill) => <SkillChip key={skill} skill={skill} />)}</div></td>
                    <td><ApplicationStatusBadge status={application.status} /></td>
                    <td>
                      <select value={application.status} onChange={(event) => updateStatus(application._id, event.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApplicantsPage;
