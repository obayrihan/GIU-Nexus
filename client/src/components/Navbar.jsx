import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">GIU Nexus</Link>
      <Link to="/jobs">Jobs</Link>

      {isAuthenticated && user?.role === 'jobSeeker' && (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/jobs/recommended">Recommended</Link>
          <Link to="/jobs/saved">Saved Jobs</Link>
          <Link to="/applications/my">My Applications</Link>
        </>
      )}

      {isAuthenticated && user?.role === 'recruiter' && (
        <>
          <Link to="/recruiter/dashboard">Recruiter Dashboard</Link>
          <Link to="/recruiter/jobs/create">Create Job</Link>
        </>
      )}

      {isAuthenticated && user?.role === 'admin' && (
        <>
          <Link to="/admin/dashboard">Admin Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/recruiters">Pending Recruiters</Link>
          <Link to="/admin/jobs">Jobs</Link>
        </>
      )}

      {!isAuthenticated ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
};

export default Navbar;