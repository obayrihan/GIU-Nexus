import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

const EditJobPage = () => {
  const { id } = useParams();
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

  const [category, setCategory] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data.job || res.data.data || res.data;

        setFormData({
          title: job.title || "",
          company: job.company || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join(", ")
            : job.requirements || "",
          location: job.location || "",
          type: job.type || "full-time",
          salary: job.salary || "",
          totalSlots: job.totalSlots || "",
        });

        setCategory(job.category || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitLoading(true);
    setError("");
    setSuccess("");

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

      const res = await api.patch(`/jobs/${id}`, payload);
      const updatedJob = res.data.job || res.data.data || res.data;

      setCategory(updatedJob.category || category);
      setSuccess("Job updated successfully.");

      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) return <Spinner />;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Edit Job</h1>

        {category && (
          <p style={styles.category}>
            AI Category: <strong>{category}</strong>
          </p>
        )}

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

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

          <button type="submit" disabled={submitLoading} style={styles.button}>
            {submitLoading ? "Updating..." : "Update Job"}
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
  success: {
    color: "#16a34a",
    marginBottom: "12px",
  },
  category: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
};

export default EditJobPage;
