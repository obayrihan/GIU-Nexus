import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import { jobService } from "../services/api";
import { useSavedJobIds } from "../utils/savedJobs";

const initialFilters = {
  keyword: "",
  location: "",
  type: "",
  status: "open",
};

function JobListPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const savedJobIds = useSavedJobIds();

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      setError("");
      try {
        const params = { ...query, page, limit: 9 };
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });
        const { data } = await jobService.getJobs(params);
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [query, page]);

  const handleChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(filters);
  };

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Jobs</h1>
        <p>Search open roles by keyword, location, type, and status.</p>
      </section>

      <form className="filter-bar" onSubmit={handleSubmit}>
        <input name="keyword" placeholder="Keyword" value={filters.keyword} onChange={handleChange} />
        <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Any type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
        </select>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Any status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit">Apply filters</button>
      </form>

      {loading ? (
        <Spinner label="Loading jobs" />
      ) : error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : jobs.length ? (
        <>
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={{ ...job, saved: savedJobIds.has(String(job._id)) }} />
            ))}
          </div>
          <div className="pagination-row">
            <button className="secondary-button" disabled={page === 1} onClick={() => setPage(page - 1)} type="button">
              Previous
            </button>
            <span>Page {page}</span>
            <button
              className="secondary-button"
              disabled={page * 9 >= total}
              onClick={() => setPage(page + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState message="No jobs match your filters." />
      )}
    </div>
  );
}

export default JobListPage;
