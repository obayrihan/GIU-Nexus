import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import { applicationService, jobService } from "../services/api";

function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [applicationStatusByJob, setApplicationStatusByJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data } = await jobService.getSavedJobs();
        setJobs(data.jobs || []);
        const applicationsResponse = await applicationService.getMyApplications();
        const statusMap = {};
        (applicationsResponse.data.applications || []).forEach((application) => {
          if (application.job?._id) {
            statusMap[String(application.job._id)] = application.status;
          }
        });
        setApplicationStatusByJob(statusMap);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load saved jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Saved Jobs</h1>
        <p>Jobs you have bookmarked.</p>
      </section>

      {loading ? (
        <Spinner label="Loading saved jobs" />
      ) : error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : jobs.length ? (
        <div className="card-grid">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={{ ...job, saved: true }}
              applicationStatus={applicationStatusByJob[String(job._id)] || "not-applied"}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="You have not saved any jobs yet." />
      )}
    </div>
  );
}

export default SavedJobsPage;
