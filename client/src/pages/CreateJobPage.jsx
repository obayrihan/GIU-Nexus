import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateJobPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    salary: "",
    totalSlots: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdJob, setCreatedJob] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setCreatedJob(null);

    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        requirements: formData.requirements
          .split(",")
          .map((req) => req.trim())
          .filter(Boolean),
        location: formData.location,
        type: formData.type,
      };

      if (formData.salary) {
        payload.salary = Number(formData.salary);
      }

      if (formData.totalSlots) {
        payload.totalSlots = Number(formData.totalSlots);
      }

      const res = await api.post("/jobs", payload);

      const job = res.data.job || res.data.data || res.data;
      setCreatedJob(job);

      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Create Job</h1>

        {error && <p style={styles.error}>{error}</p>}

        {createdJob && (
          <div style={styles.successBox}>
            <p>Job created successfully.</p>
            {createdJob.category && (
              <p>
                AI Category: <strong>{createdJob.category}</strong>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          <input
            type="text"
            name="requirements"
            placeholder="Requirements, separated by commas"
            value={formData.requirements}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>

          <input
            type="number"
            name="salary"
            placeholder="Salary optional"
            value={formData.salary}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="totalSlots"
            placeholder="Total Slots optional"
            value={formData.totalSlots}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
  },
  card: {
    width: "100%",
    maxWidth: "650px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    minHeight: "120px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    marginBottom: "12px",
  },
  successBox: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
};

export default CreateJobPage;
