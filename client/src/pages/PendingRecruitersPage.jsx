import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { adminService } from "../services/api";

function PendingRecruitersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecruiters = async () => {
    const { data } = await adminService.getUsers({ role: "recruiter", status: "pending" });
    setUsers(data.users || []);
  };

  useEffect(() => {
    async function load() {
      try {
        await loadRecruiters();
      } catch (err) {
        setError(err.response?.data?.message || "Could not load pending recruiters.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const updateStatus = async (id, status) => {
    await adminService.updateUserStatus(id, status);
    await loadRecruiters();
  };

  if (loading) return <Spinner label="Loading pending recruiters" />;

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Pending Recruiters</h1>
        <p>Approve or reject recruiter accounts.</p>
      </section>
      {error ? (
        <p className="form-alert form-alert-error">{error}</p>
      ) : (
        <UserTable users={users} onStatus={updateStatus} />
      )}
    </div>
  );
}

export function UserTable({ onDelete, onStatus, users }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td className="table-actions">
                {onStatus && <button className="secondary-button" type="button" onClick={() => onStatus(user._id, "approved")}>Approve</button>}
                {onStatus && <button className="secondary-button" type="button" onClick={() => onStatus(user._id, "rejected")}>Reject</button>}
                {onDelete && <button className="danger-button" type="button" onClick={() => onDelete(user._id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingRecruitersPage;
