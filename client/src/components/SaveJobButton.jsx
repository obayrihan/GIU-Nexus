import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/api";

function SaveJobButton({ initialSaved = false, jobId, status = "open" }) {
  const { user, isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || user?.role !== "jobSeeker") {
    return null;
  }

  const disabled = loading || status !== "open";

  const handleToggle = async () => {
    setError("");
    setLoading(true);
    const previous = saved;
    setSaved(!saved);

    try {
      const { data } = await jobService.toggleSaveJob(jobId);
      setSaved(Boolean(data.saved));
    } catch (err) {
      setSaved(previous);
      setError(err.response?.data?.message || "Could not update saved job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="save-job">
      <button className="secondary-button" type="button" disabled={disabled} onClick={handleToggle}>
        {saved ? "Unsave" : "Save"}
      </button>
      {error && <span className="inline-error">{error}</span>}
    </div>
  );
}

export default SaveJobButton;
