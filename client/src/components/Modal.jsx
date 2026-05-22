/**
 * Modal — Reusable confirmation/dialog modal.
 *
 * Props:
 *   isOpen       {boolean}   — Whether the modal is visible
 *   onClose      {function}  — Called when user clicks backdrop or Cancel
 *   onConfirm    {function}  — Called when user clicks the confirm button
 *   title        {string}    — Modal heading
 *   message      {string}    — Body text / description
 *   confirmLabel {string}    — Confirm button text (default: "Confirm")
 *   cancelLabel  {string}    — Cancel button text (default: "Cancel")
 *   danger       {boolean}   — If true, confirm button is red (for destructive actions)
 *   loading      {boolean}   — Disables buttons and shows spinner on confirm button
 */

import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
}) => {
  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* Prevent body scroll while open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`modal-icon ${danger ? "modal-icon--danger" : "modal-icon--info"}`}>
          {danger ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        {/* Content */}
        <h2 id="modal-title" className="modal-title">{title}</h2>
        {message && <p className="modal-message">{message}</p>}

        {/* Actions */}
        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn modal-btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`modal-btn ${danger ? "modal-btn--danger" : "modal-btn--confirm"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Processing…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;