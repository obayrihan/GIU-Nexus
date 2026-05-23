import { useState } from "react";
import api from "../services/api";

const SaveJobButton = ({ jobId, initiallySaved = false, disabled = false }) => {
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    if (disabled || loading) return;

    const previousSaved = saved;

    setSaved(!previousSaved);
    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/jobs/${jobId}/save`);

      if (typeof res.data.saved === "boolean") {
        setSaved(res.data.saved);
      }
    } catch (err) {
      setSaved(previousSaved);
      setError(err.response?.data?.message || "Failed to update saved job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        style={{
          ...styles.button,
          opacity: disabled || loading ? 0.6 : 1,
        }}
      >
        {loading ? "Saving..." : saved ? "★ Saved" : "☆ Save"}
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  button: {
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginTop: "6px",
  },
};

export default SaveJobButton;
