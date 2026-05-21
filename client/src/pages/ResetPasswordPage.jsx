const ResetPasswordPage = () => {
  return <div>Reset Password Page</div>;
};

export default ResetPasswordPage;
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.patch(
        `/auth/reset-password/${token}`,
        {
          newPassword,
        }
      );

      login(res.data.token, res.data.user);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">
              New Password
            </label>

            <input
              type="password"
              className="w-full border p-2 rounded"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              className="w-full border p-2 rounded"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

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
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
