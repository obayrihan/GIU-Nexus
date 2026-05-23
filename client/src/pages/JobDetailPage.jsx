import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import CategoryBadge from "../components/CategoryBadge";
import Modal from "../components/Modal";
import SaveJobButton from "../components/SaveJobButton";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { applicationService, jobService } from "../services/api";

function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyStatus, setApplyStatus] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const { data } = await jobService.getJobById(id);
        setJob(data.job);
        if (user?.role === "jobSeeker") {
          const [savedResponse, applicationsResponse] = await Promise.all([
            jobService.getSavedJobs(),
            applicationService.getMyApplications(),
          ]);
          const isSaved = (savedResponse.data.jobs || []).some((savedJob) => String(savedJob._id) === String(id));
          const application = (applicationsResponse.data.applications || []).find((item) => String(item.job?._id) === String(id));
          setJob({ ...data.job, saved: isSaved });
          if (application?.status) {
            setApplyStatus(application.status);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Could not load job.");
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id, user?.role]);

  const handleApply = async (event) => {
    event.preventDefault();
    setApplyStatus("");
    setApplying(true);
    try {
      await jobService.applyToJob(id, coverLetter);
      setApplyStatus("pending");
      setIsApplyOpen(false);
    } catch (err) {
      setApplyStatus(err.response?.data?.message || "Could not submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner label="Loading job" />;
  if (error) return <p className="form-alert form-alert-error">{error}</p>;
  if (!job) return null;

  return (
    <div className="page-stack">
      <section className="detail-header">
        <div>
          <h1>{job.title}</h1>
          <p>{job.company} - {job.location} - {job.type}</p>
        </div>
        <CategoryBadge category={job.category} />
      </section>

      <section className="content-section">
        <h2>Description</h2>
        <p>{job.description}</p>
      </section>

      <section className="content-section">
        <h2>Requirements</h2>
        <div className="chip-row">
          {(job.requirements || []).length ? job.requirements.map((item) => <span className="skill-chip" key={item}>{item}</span>) : <p>No requirements listed.</p>}
        </div>
      </section>

      <section className="content-section split-row">
        <div>
          <h2>Salary</h2>
          <p>{job.salary ? `${job.salary}` : "Not listed"}</p>
        </div>
        <div>
          <h2>Status</h2>
          <p>{job.status}</p>
        </div>
      </section>

      {user?.role === "jobSeeker" && (
        <section className="action-panel">
          {["pending", "shortlisted", "rejected"].includes(applyStatus) ? (
            <ApplicationStatusBadge status={applyStatus} />
          ) : (
            <button type="button" onClick={() => setIsApplyOpen(true)}>
              Apply
            </button>
          )}
          <SaveJobButton jobId={job._id} status={job.status} initialSaved={job.saved} />
          {applyStatus && applyStatus !== "pending" && <p className="form-alert form-alert-error">{applyStatus}</p>}
        </section>
      )}

      <Modal isOpen={isApplyOpen} title="Apply to job" onClose={() => setIsApplyOpen(false)}>
        <form className="auth-form" onSubmit={handleApply}>
          <label>
            Cover letter
            <textarea rows="5" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} />
          </label>
          <button type="submit" disabled={applying}>{applying ? "Submitting..." : "Submit application"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default JobDetailPage;
