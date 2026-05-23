import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.patch(`/auth/reset-password/${token}`, { password }),
};

export const profileService = {
  getProfile: () => api.get("/profile"),
  updateProfile: (profileData) => api.patch("/profile", profileData),
  changePassword: (passwordData) => api.patch("/profile/change-password", passwordData),
  extractSkills: () => api.post("/profile/extract-skills"),
};

export const jobService = {
  getJobs: (params) => api.get("/jobs", { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getRecommendedJobs: () => api.get("/jobs/recommended"),
  getSavedJobs: () => api.get("/jobs/saved"),
  getMyJobs: () => api.get("/jobs/my-jobs"),
  createJob: (jobData) => api.post("/jobs", jobData),
  updateJob: (id, jobData) => api.patch(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  toggleSaveJob: (id) => api.post(`/jobs/${id}/save`),
  applyToJob: (jobId, coverLetter) => api.post(`/jobs/${jobId}/apply`, { coverLetter }),
  getApplicants: (jobId) => api.get(`/jobs/${jobId}/applicants`),
};

export const applicationService = {
  getMyApplications: () => api.get("/applications/my"),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  getApplications: (params) => api.get("/applications", { params }),
};

export const adminService = {
  getStats: () => api.get("/admin/stats"),
  createUser: (userData) => api.post("/users", userData),
  getUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
