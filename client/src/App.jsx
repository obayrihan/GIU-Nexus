import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobsPage from "./pages/AdminJobsPage";
import AdminApplicationsPage from "./pages/AdminApplicationsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CreateJobPage from "./pages/CreateJobPage";
import EditJobPage from "./pages/EditJobPage";
import EditProfilePage from "./pages/EditProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import JobDetailPage from "./pages/JobDetailPage";
import JobListPage from "./pages/JobListPage";
import LoginPage from "./pages/LoginPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import PendingRecruitersPage from "./pages/PendingRecruitersPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendedJobsPage from "./pages/RecommendedJobsPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SavedJobsPage from "./pages/SavedJobsPage";

function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "recruiter") return <Navigate to="/recruiter/dashboard" replace />;
  return <Navigate to="/profile" replace />;
}

function Unauthorized() {
  return (
    <section className="page-section">
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
    </section>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/change-password" element={<ChangePasswordPage />} />

              <Route element={<RoleRoute allowedRoles={["jobSeeker"]} />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/jobs/recommended" element={<RecommendedJobsPage />} />
                <Route path="/jobs/saved" element={<SavedJobsPage />} />
                <Route path="/applications/my" element={<MyApplicationsPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
                <Route path="/recruiter/jobs/:id/edit" element={<EditJobPage />} />
                <Route path="/recruiter/applicants/:jobId" element={<ApplicantsPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/recruiters" element={<PendingRecruitersPage />} />
                <Route path="/admin/applications" element={<AdminApplicationsPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
