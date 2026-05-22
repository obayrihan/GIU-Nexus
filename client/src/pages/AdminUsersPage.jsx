/**
 * AdminUsersPage — /admin/users
 *
 * Features:
 *  - Fetch all users via GET /api/v1/users
 *  - Filter by role and status via query params
 *  - Delete user via DELETE /api/v1/users/:id (with Modal confirmation)
 *  - Change user status via PATCH /api/v1/users/:id/status
 *  - Loading, error, and empty states
 *  - Responsive table layout
 */

import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import "./AdminUsersPage.css";

/* ── Role badge colors ── */
const ROLE_COLORS = {
  jobSeeker: { bg: "#e0f2fe", color: "#0369a1" },
  recruiter: { bg: "#fef3c7", color: "#92400e" },
  admin:     { bg: "#ede9fe", color: "#5b21b6" },
};

/* ── Status badge colors ── */
const STATUS_COLORS = {
  active:   { bg: "#dcfce7", color: "#166534" },
  pending:  { bg: "#fef9c3", color: "#854d0e" },
  approved: { bg: "#dcfce7", color: "#166534" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
};

const AdminUsersPage = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* Delete modal state */
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null, userName: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* Status modal state */
  const [statusModal, setStatusModal] = useState({ open: false, userId: null, newStatus: "", userName: "" });
  const [statusLoading, setStatusLoading] = useState(false);

  /* ── Fetch users ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (roleFilter)   params.role   = roleFilter;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/api/v1/users", { params });
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ── Delete user ── */
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/v1/users/${deleteModal.userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteModal.userId));
      setDeleteModal({ open: false, userId: null, userName: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── Change status ── */
  const handleStatusConfirm = async () => {
    setStatusLoading(true);
    try {
      await api.patch(`/api/v1/users/${statusModal.userId}/status`, {
        status: statusModal.newStatus,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === statusModal.userId ? { ...u, status: statusModal.newStatus } : u
        )
      );
      setStatusModal({ open: false, userId: null, newStatus: "", userName: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="aup-page">
      <div className="aup-header">
        <div>
          <h1 className="aup-title">User Management</h1>
          <p className="aup-subtitle">{users.length} user{users.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="aup-filters">
        <select
          className="aup-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="">All Roles</option>
          <option value="jobSeeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>

        <select
          className="aup-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="aup-error" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="aup-loading">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="aup-empty">
          <p>No users found matching your filters.</p>
        </div>
      ) : (
        /* Table */
        <div className="aup-table-wrap">
          <table className="aup-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="aup-td-name">{user.name}</td>
                  <td className="aup-td-email">{user.email}</td>
                  <td>
                    <span
                      className="aup-badge"
                      style={{
                        background: ROLE_COLORS[user.role]?.bg || "#f1f5f9",
                        color: ROLE_COLORS[user.role]?.color || "#475569",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className="aup-badge"
                      style={{
                        background: STATUS_COLORS[user.status]?.bg || "#f1f5f9",
                        color: STATUS_COLORS[user.status]?.color || "#475569",
                      }}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="aup-td-actions">
                    {/* Approve button — only for pending recruiters */}
                    {user.role === "recruiter" && user.status === "pending" && (
                      <button
                        type="button"
                        className="aup-btn aup-btn--approve"
                        onClick={() =>
                          setStatusModal({
                            open: true,
                            userId: user._id,
                            newStatus: "approved",
                            userName: user.name,
                          })
                        }
                      >
                        Approve
                      </button>
                    )}
                    {/* Reject button */}
                    {user.status !== "rejected" && user.role !== "admin" && (
                      <button
                        type="button"
                        className="aup-btn aup-btn--reject"
                        onClick={() =>
                          setStatusModal({
                            open: true,
                            userId: user._id,
                            newStatus: "rejected",
                            userName: user.name,
                          })
                        }
                      >
                        Reject
                      </button>
                    )}
                    {/* Delete button */}
                    <button
                      type="button"
                      className="aup-btn aup-btn--delete"
                      onClick={() =>
                        setDeleteModal({
                          open: true,
                          userId: user._id,
                          userName: user.name,
                        })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, userId: null, userName: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
      />

      {/* Status change modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, userId: null, newStatus: "", userName: "" })}
        onConfirm={handleStatusConfirm}
        title={`${statusModal.newStatus === "approved" ? "Approve" : "Reject"} User`}
        message={`Are you sure you want to ${statusModal.newStatus === "approved" ? "approve" : "reject"} "${statusModal.userName}"?`}
        confirmLabel={statusModal.newStatus === "approved" ? "Approve" : "Reject"}
        danger={statusModal.newStatus === "rejected"}
        loading={statusLoading}
      />
    </div>
  );
};

export default AdminUsersPage;