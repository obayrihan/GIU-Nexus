import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

function RoleRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner label="Checking access" />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
