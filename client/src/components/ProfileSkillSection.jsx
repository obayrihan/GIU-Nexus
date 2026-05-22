/**
 * ProfileSkillSection — AI-enhanced skill display section for ProfilePage.
 *
 * Props:
 *   skills        {string[]}  — Currently stored skills
 *   loading       {boolean}   — True while profile is first loading
 *   onSkillsUpdated {fn}      — Callback with new skills[] after extraction
 *
 * Handles:
 *   - Skeleton while profile loads
 *   - Empty state + Extract button when no skills
 *   - Inline bio-empty error with link to /profile/edit
 *   - Success animation after extraction
 *   - Grid of SkillChip components
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import SkillChip from "./SkillChip";
import { SkillSkeleton, SkillEmptyState } from "./SkillStates";
import { extractSkillsFromBio } from "../services/profileService";
import "./ProfileSkillSection.css";

const ProfileSkillSection = ({ skills = [], loading = false, onSkillsUpdated }) => {
  const [extracting, setExtracting]     = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [justExtracted, setJustExtracted] = useState(false);

  const handleExtract = async () => {
    setExtracting(true);
    setExtractError(null);
    setJustExtracted(false);

    try {
      const newSkills = await extractSkillsFromBio();
      // Notify parent (ProfilePage) to update its local state — no full reload needed
      onSkillsUpdated?.(newSkills);
      setJustExtracted(true);
      // Clear the "just extracted" highlight after 3 s
      setTimeout(() => setJustExtracted(false), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Could not extract skills. Please try again.";
      setExtractError(msg);
    } finally {
      setExtracting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <section className="pss" aria-label="Skills section">
        <div className="pss__header">
          <h2 className="pss__title">Skills</h2>
        </div>
        <SkillSkeleton count={8} />
      </section>
    );
  }

  const hasSkills = skills.length > 0;

  return (
    <section className="pss" aria-label="Skills section">
      {/* Section header + Extract button */}
      <div className="pss__header">
        <h2 className="pss__title">Skills</h2>
        {hasSkills && (
          <button
            className={`pss__extract-btn ${extracting ? "pss__extract-btn--loading" : ""}`}
            onClick={handleExtract}
            disabled={extracting}
            type="button"
            aria-label="Re-extract skills from bio using AI"
          >
            {extracting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Extracting…
              </>
            ) : (
              <>
                {/* Sparkle icon */}
                <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a4 4 0 118 0v1H8zm-2 2a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                </svg>
                Re-extract from Bio
              </>
            )}
          </button>
        )}
      </div>

      {/* Inline error from bio-empty or server */}
      {extractError && (
        <div className="pss__error" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>
            {extractError}{" "}
            {/* Bio-empty error: link to edit profile */}
            {extractError.toLowerCase().includes("bio") && (
              <Link to="/profile/edit" className="pss__error-link">
                Update your profile →
              </Link>
            )}
          </span>
        </div>
      )}

      {/* Success banner */}
      {justExtracted && !extractError && (
        <div className="pss__success" role="status" aria-live="polite">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Skills extracted successfully!
        </div>
      )}

      {/* Skills grid OR empty state */}
      {hasSkills ? (
        <div className={`pss__grid ${justExtracted ? "pss__grid--new" : ""}`}>
          {skills.map((skill) => (
            <SkillChip key={skill} skill={skill} />
          ))}
        </div>
      ) : (
        <SkillEmptyState onExtract={handleExtract} extracting={extracting} />
      )}
    </section>
  );
};

export default ProfileSkillSection;
