/**
 * Spinner — Reusable loading spinner component.
 *
 * Props:
 *   size    {string}  — "sm" | "md" | "lg" (default: "md")
 *   color   {string}  — CSS color string (default: "#6366f1")
 *   label   {string}  — Accessible label (default: "Loading...")
 */

import React from "react";


const SIZES = {
  sm: 18,
  md: 32,
  lg: 48,
};

const Spinner = ({ size = "md", color = "#6366f1", label = "Loading..." }) => {
  const px = SIZES[size] || SIZES.md;

  return (
    <div
      className="spinner-wrap"
      role="status"
      aria-label={label}
      style={{ width: px, height: px }}
    >
      <svg
        className="spinner-svg"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        width={px}
        height={px}
        aria-hidden="true"
      >
        <circle
          className="spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
        <circle
          className="spinner-head"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </svg>
      <span className="spinner-sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
