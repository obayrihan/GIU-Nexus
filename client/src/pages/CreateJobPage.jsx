import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBadge from "../components/CategoryBadge";
import { jobService } from "../services/api";

const initialJob = {
  title: "",
  company: "",
  description: "",
  requirements: "",
  location: "",
  type: "internship",
  salary: "",
  totalSlots: 1,
};

function CreateJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialJob);
  const [createdJob, setCreatedJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(",").map((item) => item.trim()).filter(Boolean),
        salary: formData.salary ? Number(formData.salary) : undefined,
        totalSlots: Number(formData.totalSlots),
      };
      const { data } = await jobService.createJob(payload);
      setCreatedJob(data.job);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create job.");
    } finally {
      setLoading(false);
    }
  };

  if (createdJob) {
    return (
      <section className="content-section">
        <h1>Job Created</h1>
        <p>The backend assigned this category:</p>
        <CategoryBadge category={createdJob.category} />
        <div className="button-row">
          <button type="button" onClick={() => navigate(`/jobs/${createdJob._id}`)}>View job</button>
          <button className="secondary-button" type="button" onClick={() => setCreatedJob(null)}>Create another</button>
        </div>
      </section>
    );
  }

  return (
    <section className="form-page">
      <h1>Create Job</h1>
      <JobForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Create job" />
    </section>
  );
}

export function JobForm({ error, formData, loading, onChange, onSubmit, submitLabel }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>Title<input name="title" value={formData.title} onChange={onChange} required /></label>
      <label>Company<input name="company" value={formData.company} onChange={onChange} required /></label>
      <label>Description<textarea name="description" rows="6" value={formData.description} onChange={onChange} required /></label>
      <label>Requirements<input name="requirements" value={formData.requirements} onChange={onChange} placeholder="React, Node.js, MongoDB" /></label>
      <label>Location<input name="location" value={formData.location} onChange={onChange} required /></label>
      <label>
        Type
        <select name="type" value={formData.type} onChange={onChange}>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
        </select>
      </label>
      <label>Salary<input name="salary" type="number" value={formData.salary} onChange={onChange} /></label>
      <label>Total slots<input name="totalSlots" type="number" min="1" value={formData.totalSlots} onChange={onChange} /></label>
      {error && <p className="form-alert form-alert-error">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Saving..." : submitLabel}</button>
    </form>
  );
}

export default CreateJobPage;
