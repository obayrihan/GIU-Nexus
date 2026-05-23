/**
 * ChangePasswordPage — /profile/change-password
 *
 * Features:
 *  - Current / New / Confirm password fields with show-hide toggle
 *  - Client-side validation (match, min length)
 *  - Password strength meter
 *  - Inline backend 401 error handling ("Current password is incorrect")
 *  - Loading spinner in submit button, disabled while in-flight
 *  - Success confirmation message
 */

import React, { useState } from "react";
import { changePassword } from "../services/profileService";
import "./ChangePasswordPage.css";

/* ── Password strength helper ── */
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
};

const STRENGTH_LABELS = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

/* ── Eye icon ── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
    </svg>
  );

/* ── Main component ── */
const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showFields, setShowFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.newPassword);

  /* Toggle show/hide for a single field */
  const toggleShow = (field) =>
    setShowFields((prev) => ({ ...prev, [field]: !prev[field] }));

  /* Update a form field and clear its error */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    setSuccess(false);
  };

  /* Client-side validation — returns an errors object */
  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = "Current password is required.";
    if (!form.newPassword) {
      errs.newPassword = "New password is required.";
    } else if (form.newPassword.length < 8) {
      errs.newPassword = "New password must be at least 8 characters.";
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your new password.";
    } else if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await changePassword(form.currentPassword, form.newPassword);
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";

      if (status === 401) {
        // Inline error: wrong current password
        setErrors({ currentPassword: msg });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpw-page">
      <div className="cpw-card">
        {/* Header */}
        <div className="cpw-header">
          <div className="cpw-header__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div>
            <h1 className="cpw-header__title">Change Password</h1>
            <p className="cpw-header__subtitle">Keep your account secure with a strong password.</p>
          </div>
        </div>

        {/* Success banner */}
        {success && (
          <div className="cpw-success" role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Password updated successfully!
          </div>
        )}

        {/* General error */}
        {errors.general && (
          <div className="cpw-error-banner" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="cpw-form">
          {/* Current Password */}
          <div className="cpw-field">
            <label htmlFor="currentPassword" className="cpw-label">
              Current Password
            </label>
            <div className={`cpw-input-wrap ${errors.currentPassword ? "cpw-input-wrap--error" : ""}`}>
              <input
                id="currentPassword"
                name="currentPassword"
                type={showFields.currentPassword ? "text" : "password"}
                value={form.currentPassword}
                onChange={handleChange}
                className="cpw-input"
                autoComplete="current-password"
                aria-describedby={errors.currentPassword ? "err-current" : undefined}
                aria-invalid={!!errors.currentPassword}
              />
              <button
                type="button"
                className="cpw-toggle"
                onClick={() => toggleShow("currentPassword")}
                aria-label={showFields.currentPassword ? "Hide current password" : "Show current password"}
              >
                <EyeIcon open={showFields.currentPassword} />
              </button>
            </div>
            {errors.currentPassword && (
              <p id="err-current" className="cpw-field-error" role="alert">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="cpw-field">
            <label htmlFor="newPassword" className="cpw-label">
              New Password
            </label>
            <div className={`cpw-input-wrap ${errors.newPassword ? "cpw-input-wrap--error" : ""}`}>
              <input
                id="newPassword"
                name="newPassword"
                type={showFields.newPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                className="cpw-input"
                autoComplete="new-password"
                aria-describedby="pw-strength"
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                className="cpw-toggle"
                onClick={() => toggleShow("newPassword")}
                aria-label={showFields.newPassword ? "Hide new password" : "Show new password"}
              >
                <EyeIcon open={showFields.newPassword} />
              </button>
            </div>
            {errors.newPassword && (
              <p className="cpw-field-error" role="alert">{errors.newPassword}</p>
            )}
            {/* Password strength meter */}
            {form.newPassword.length > 0 && (
              <div className="cpw-strength" id="pw-strength" aria-live="polite">
                <div className="cpw-strength__bar">
                  {[1, 2, 3, 4, 5].map((seg) => (
                    <div
                      key={seg}
                      className="cpw-strength__seg"
                      style={{
                        backgroundColor: strength >= seg ? STRENGTH_COLORS[strength] : undefined,
                      }}
                    />
                  ))}
                </div>
                <span
                  className="cpw-strength__label"
                  style={{ color: STRENGTH_COLORS[strength] }}
                >
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="cpw-field">
            <label htmlFor="confirmPassword" className="cpw-label">
              Confirm New Password
            </label>
            <div className={`cpw-input-wrap ${errors.confirmPassword ? "cpw-input-wrap--error" : ""}`}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showFields.confirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                className="cpw-input"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                className="cpw-toggle"
                onClick={() => toggleShow("confirmPassword")}
                aria-label={showFields.confirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <EyeIcon open={showFields.confirmPassword} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="cpw-field-error" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="cpw-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Updating…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
