import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

function ResetPasswordPage() {
  const { token } = useParams();
  const { saveSession } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await authService.resetPassword(token, password);
      if (data.token && data.user) {
        saveSession(data);
      }
      setMessage(data.message || "Your password has been reset.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset is not available yet. Please request a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Reset Password</h1>
        <p>Choose a new password for your GIU Nexus account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            New password
            <input
              autoComplete="new-password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <label>
            Confirm password
            <input
              autoComplete="new-password"
              minLength={6}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </label>

          {error && <p className="form-alert form-alert-error">{error}</p>}
          {message && <p className="form-alert form-alert-success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
