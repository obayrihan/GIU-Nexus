import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { jobService } from "../services/api";
import { JobForm } from "./CreateJobPage";

function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        const { data } = await jobService.getJobById(id);
        const job = data.job;
        setFormData({
          title: job.title || "",
          company: job.company || "",
          description: job.description || "",
          requirements: (job.requirements || []).join(", "),
          location: job.location || "",
          type: job.type || "internship",
          salary: job.salary || "",
          totalSlots: job.totalSlots || 1,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load job.");
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await jobService.updateJob(id, {
        ...formData,
        requirements: formData.requirements.split(",").map((item) => item.trim()).filter(Boolean),
        salary: formData.salary ? Number(formData.salary) : undefined,
        totalSlots: Number(formData.totalSlots),
      });
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading job" />;
  if (!formData) return <p className="form-alert form-alert-error">{error}</p>;

  return (
    <section className="form-page">
      <h1>Edit Job</h1>
      <JobForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={saving} error={error} submitLabel="Save changes" />
    </section>
  );
}

export default EditJobPage;
