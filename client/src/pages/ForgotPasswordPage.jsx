import { useState } from "react";
import api from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      setSuccessMessage(
        "If an account exists, a reset email has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {successMessage && (
            <p className="text-green-600 mb-3">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="text-red-600 mb-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

