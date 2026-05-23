import { useCallback, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { adminService } from "../services/api";
import { UserTable } from "./PendingRecruitersPage";

function AdminUsersPage() {
  const [filters, setFilters] = useState({ role: "", status: "" });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobSeeker",
    status: "approved",
    skills: "",
  });
  const [query, setQuery] = useState(filters);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");

  const loadUsers = useCallback(async (params = query) => {
    const clean = { ...params };
    Object.keys(clean).forEach((key) => {
      if (!clean[key]) delete clean[key];
    });
    const { data } = await adminService.getUsers(clean);
    setUsers(data.users || []);
  }, [query]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        await loadUsers(query);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load users.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [loadUsers, query]);

  const updateStatus = async (id, status) => {
    await adminService.updateUserStatus(id, status);
    await loadUsers();
  };

  const deleteUser = async (id) => {
    await adminService.deleteUser(id);
    await loadUsers();
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setCreateError("");
    setCreating(true);

    try {
      await adminService.createUser({
        ...newUser,
        skills: newUser.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      });
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "jobSeeker",
        status: "approved",
        skills: "",
      });
      await loadUsers();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Could not create user.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="page-title">
        <h1>Admin Users</h1>
        <p>Create demo users, filter accounts, update status, or delete old users.</p>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <h2>Create User</h2>
        </div>
        <form className="filter-bar" onSubmit={handleCreateUser}>
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={newUser.email}
            onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
            required
          />
          <select value={newUser.role} onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))}>
            <option value="jobSeeker">Job seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <select value={newUser.status} onChange={(event) => setNewUser((current) => ({ ...current, status: event.target.value }))}>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            placeholder="Skills: React, Node.js"
            value={newUser.skills}
            onChange={(event) => setNewUser((current) => ({ ...current, skills: event.target.value }))}
          />
          <button type="submit" disabled={creating}>{creating ? "Creating..." : "Create user"}</button>
        </form>
        {createError && <p className="form-alert form-alert-error">{createError}</p>}
      </section>
      <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); setQuery(filters); }}>
        <select value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}>
          <option value="">Any role</option>
          <option value="jobSeeker">Job seeker</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
        <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="">Any status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">Apply filters</button>
      </form>
      {loading ? <Spinner label="Loading users" /> : error ? <p className="form-alert form-alert-error">{error}</p> : <UserTable users={users} onStatus={updateStatus} onDelete={deleteUser} />}
    </div>
  );
}

export default AdminUsersPage;
