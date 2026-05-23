import { useCallback, useEffect, useState } from "react";
import CategoryBadge from "../components/CategoryBadge";
import Spinner from "../components/Spinner";
import { jobService } from "../services/api";

const emptyJob = {
  title: "",
  company: "",
  description: "",
  requirements: "",
  location: "",
  type: "internship",
  salary: "",
  totalSlots: 1,
  status: "open",
};

function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState(emptyJob);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");

  const loadJobs = useCallback(async () => {
    const { data } = await jobService.getJobs({ limit: 50 });
    setJobs(data.jobs || []);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await loadJobs();
      } catch (err) {
        setError(err.response?.data?.message || "Could not load jobs.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [loadJobs]);

  const deleteJob = async (id) => {
    await jobService.deleteJob(id);
    await loadJobs();
  };

  const handleCreateJob = async (event) => {
    event.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      await jobService.createJob({
        ...newJob,
        requirements: newJob.requirements.split(",").map((item) => item.trim()).filter(Boolean),
        salary: newJob.salary ? Number(newJob.salary) : undefined,
        totalSlots: Number(newJob.totalSlots),
      });
      setNewJob(emptyJob);
      await loadJobs();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Could not create job.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Spinner label="Loading jobs" />;

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Admin Jobs</h1>
        <p>Add demo jobs and remove platform listings.</p>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <h2>Add Job</h2>
        </div>
        <form className="filter-bar" onSubmit={handleCreateJob}>
          <input placeholder="Title" value={newJob.title} onChange={(event) => setNewJob((current) => ({ ...current, title: event.target.value }))} required />
          <input placeholder="Company" value={newJob.company} onChange={(event) => setNewJob((current) => ({ ...current, company: event.target.value }))} required />
          <input placeholder="Location" value={newJob.location} onChange={(event) => setNewJob((current) => ({ ...current, location: event.target.value }))} required />
          <select value={newJob.type} onChange={(event) => setNewJob((current) => ({ ...current, type: event.target.value }))}>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
          <select value={newJob.status} onChange={(event) => setNewJob((current) => ({ ...current, status: event.target.value }))}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <input placeholder="Salary" type="number" value={newJob.salary} onChange={(event) => setNewJob((current) => ({ ...current, salary: event.target.value }))} />
          <input placeholder="Slots" type="number" min="1" value={newJob.totalSlots} onChange={(event) => setNewJob((current) => ({ ...current, totalSlots: event.target.value }))} />
          <input placeholder="Requirements: React, Node.js" value={newJob.requirements} onChange={(event) => setNewJob((current) => ({ ...current, requirements: event.target.value }))} />
          <textarea placeholder="Description" value={newJob.description} onChange={(event) => setNewJob((current) => ({ ...current, description: event.target.value }))} required />
          <button type="submit" disabled={creating}>{creating ? "Adding..." : "Add job"}</button>
        </form>
        {createError && <p className="form-alert form-alert-error">{createError}</p>}
      </section>
      {error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Company</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td><CategoryBadge category={job.category} /></td>
                  <td>{job.status}</td>
                  <td><button className="danger-button" type="button" onClick={() => deleteJob(job._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminJobsPage;
