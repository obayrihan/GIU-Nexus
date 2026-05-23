import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <Link className="brand" to="/">
          GIU Nexus
        </Link>

        <div className="nav-links">
          <NavLink to="/jobs">Jobs</NavLink>
          {isAuthenticated && user?.role === "jobSeeker" && (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/jobs/recommended">Recommended</NavLink>
              <NavLink to="/jobs/saved">Saved</NavLink>
              <NavLink to="/applications/my">Applications</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === "recruiter" && (
            <>
              <NavLink to="/recruiter/dashboard">Recruiter</NavLink>
              <NavLink to="/recruiter/jobs/create">Create Job</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <>
              <NavLink to="/admin/dashboard">Admin</NavLink>
              <NavLink to="/admin/recruiters">Recruiters</NavLink>
              <NavLink to="/admin/applications">Applications</NavLink>
              <NavLink to="/admin/jobs">Jobs Admin</NavLink>
              <NavLink to="/admin/users">Users</NavLink>
            </>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-chip">{user?.name || user?.email}</span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="button-link" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
