import { useState } from "react";
import { profileService } from "../services/api";

function ChangePasswordPage() {
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await profileService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage(data.message || "Password updated successfully.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <h1>Change Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Current password
          <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} required />
        </label>
        <label>
          New password
          <input name="newPassword" type="password" minLength={6} value={formData.newPassword} onChange={handleChange} required />
        </label>
        <label>
          Confirm new password
          <input name="confirmPassword" type="password" minLength={6} value={formData.confirmPassword} onChange={handleChange} required />
        </label>
        {error && <p className="form-alert form-alert-error">{error}</p>}
        {message && <p className="form-alert form-alert-success">{message}</p>}
        <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update password"}</button>
      </form>
    </section>
  );
}

export default ChangePasswordPage;
