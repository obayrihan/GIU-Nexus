/**
 * PendingRecruitersPage — /admin/recruiters
 *
 * Features:
 *  - Fetch pending recruiters via GET /api/v1/users?role=recruiter&status=pending
 *  - Approve via PATCH /api/v1/users/:id/status { status: "approved" }
 *  - Reject  via PATCH /api/v1/users/:id/status { status: "rejected" }
 *  - Modal confirmation before each action
 *  - Loading, error, and empty states
 */

import React, { useState, useEffect } from "react";
import api from "/../services/api";
import Spinner from "/../components/Spinner";
import Modal from "/../components/Modal";
import "./PendingRecruitersPage.css";

const PendingRecruitersPage = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  /* Modal state */
  const [modal, setModal] = useState({
    open: false,
    userId: null,
    userName: "",
    action: "", // "approved" | "rejected"
  });
  const [actionLoading, setActionLoading] = useState(false);

  /* ── Fetch pending recruiters ── */
  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/api/v1/users", {
          params: { role: "recruiter", status: "pending" },
        });
        setRecruiters(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load pending recruiters.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  /* ── Approve or Reject ── */
  const handleActionConfirm = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/api/v1/users/${modal.userId}/status`, {
        status: modal.action,
      });
      // Remove from pending list after action
      setRecruiters((prev) => prev.filter((r) => r._id !== modal.userId));
      setModal({ open: false, userId: null, userName: "", action: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (user, action) => {
    setModal({ open: true, userId: user._id, userName: user.name, action });
  };

  return (
    <div className="prp-page">
      {/* Header */}
      <div className="prp-header">
        <div className="prp-header__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <div>
          <h1 className="prp-title">Pending Recruiters</h1>
          <p className="prp-subtitle">
            {loading ? "Loading…" : `${recruiters.length} recruiter${recruiters.length !== 1 ? "s" : ""} awaiting approval`}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="prp-error" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="prp-loading">
          <Spinner size="lg" />
        </div>
      ) : recruiters.length === 0 ? (
        /* Empty state */
        <div className="prp-empty">
          <div className="prp-empty__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
              <circle cx="32" cy="32" r="30" fill="#f0fdf4" />
              <path d="M22 38c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
              <circle cx="32" cy="22" r="6" stroke="#22c55e" strokeWidth="2" />
              <path d="M40 34l4 4M44 34l-4 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="prp-empty__title">All caught up!</h3>
          <p className="prp-empty__body">No recruiters are currently pending approval.</p>
        </div>
      ) : (
        /* Cards grid */
        <div className="prp-grid">
          {recruiters.map((recruiter) => (
            <div key={recruiter._id} className="prp-card">
              {/* Avatar */}
              <div className="prp-card__avatar">
                {recruiter.name?.charAt(0).toUpperCase() || "R"}
              </div>

              {/* Info */}
              <div className="prp-card__info">
                <h3 className="prp-card__name">{recruiter.name}</h3>
                <p className="prp-card__email">{recruiter.email}</p>
                <span className="prp-card__badge">Pending Approval</span>
              </div>

              {/* Actions */}
              <div className="prp-card__actions">
                <button
                  type="button"
                  className="prp-btn prp-btn--approve"
                  onClick={() => openModal(recruiter, "approved")}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Approve
                </button>
                <button
                  type="button"
                  className="prp-btn prp-btn--reject"
                  onClick={() => openModal(recruiter, "rejected")}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, userId: null, userName: "", action: "" })}
        onConfirm={handleActionConfirm}
        title={modal.action === "approved" ? "Approve Recruiter" : "Reject Recruiter"}
        message={`Are you sure you want to ${modal.action === "approved" ? "approve" : "reject"} "${modal.userName}"?`}
        confirmLabel={modal.action === "approved" ? "Approve" : "Reject"}
        danger={modal.action === "rejected"}
        loading={actionLoading}
      />
    </div>
  );
};

export default PendingRecruitersPage;
