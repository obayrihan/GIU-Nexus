/**
 * services/profileService.js
 *
 * All profile-related API calls routed through the shared axios instance (api.js).
 * The axios instance in api.js already:
 *   - Attaches Authorization: Bearer <token> on every request
 *   - Intercepts 401 responses, calls logout(), and redirects to /login
 *
 * Import `api` from './api' — do NOT import axios directly.
 */

import api from "./api";

/* ─────────────────────────────────────────
   CHANGE PASSWORD
   PATCH /profile/change-password
───────────────────────────────────────── */

/**
 * Change the authenticated user's password.
 *
 * @param {string} currentPassword — The user's existing password
 * @param {string} newPassword     — The desired new password
 * @returns {Promise<{message: string}>}
 *
 * Throws with response.data.message on non-2xx responses.
 * Callers should handle 401 ("Current password is incorrect") inline.
 */
export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.patch("/profile/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};

/* ─────────────────────────────────────────
   AI SKILL EXTRACTION
   POST /profile/extract-skills
───────────────────────────────────────── */

/**
 * Ask the backend AI to extract skills from the authenticated user's bio.
 *
 * Success response shape:
 *   { success: true, skills: string[] }
 *
 * Possible error (400):
 *   { message: "Bio is empty. Update your profile first." }
 *
 * @returns {Promise<string[]>} — Array of extracted skill strings
 */
export const extractSkillsFromBio = async () => {
  const { data } = await api.post("/profile/extract-skills");

  if (!data.success || !Array.isArray(data.skills)) {
    throw new Error("Unexpected response from skill extraction endpoint.");
  }

  return data.skills;
};

/* ─────────────────────────────────────────
   GET PROFILE
   GET /profile
───────────────────────────────────────── */

/**
 * Fetch the current authenticated user's full profile.
 *
 * @returns {Promise<Object>} — Profile object including name, bio, skills[], profilePicture
 */
export const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};
