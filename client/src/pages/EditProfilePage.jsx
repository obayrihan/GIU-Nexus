import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        const { name, bio, profilePicture } = res.data.user;
        setFormData({
          name: name || "",
          bio: bio || "",
          profilePicture: profilePicture || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.patch("/profile", formData);
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Profile</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              style={styles.input}
            />
          </div>

          {/* Bio */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write about your background, skills, and experience..."
              rows={5}
              style={{ ...styles.input, resize: "vertical" }}
            />
            <p style={styles.hint}>
              💡 A detailed bio helps the AI extract your skills automatically.
            </p>
          </div>

          {/* Profile Picture URL */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Profile Picture URL</label>
            <input
              type="text"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              style={styles.input}
            />
            {formData.profilePicture && (
              <img
                src={formData.profilePicture}
                alt="Preview"
                style={styles.preview}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          {/* Buttons */}
          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={saving ? { ...styles.saveButton, opacity: 0.6 } : styles.saveButton}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "560px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "24px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    fontSize: "15px",
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
  preview: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginTop: "8px",
    border: "2px solid #4f46e5",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  cancelButton: {
    padding: "10px 24px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 28px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "8px",
  },
  success: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "8px",
  },
};