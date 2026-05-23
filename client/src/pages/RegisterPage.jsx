import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobSeeker",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Register</h1>
        <p>Create a GIU Nexus account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              autoComplete="name"
              name="name"
              onChange={handleChange}
              required
              type="text"
              value={formData.name}
            />
          </label>

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="new-password"
              minLength={6}
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={formData.password}
            />
          </label>

          <label>
            Account type
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="jobSeeker">Job seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>

          {error && <p className="form-alert form-alert-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
