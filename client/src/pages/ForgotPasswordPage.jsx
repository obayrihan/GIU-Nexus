import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data } = await authService.forgotPassword(email);
      setMessage(data.message || "Password reset instructions have been sent.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset is not available yet. Please contact support.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Forgot Password</h1>
        <p>Enter your email and we will send reset instructions if the account exists.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          {error && <p className="form-alert form-alert-error">{error}</p>}
          {message && <p className="form-alert form-alert-success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
