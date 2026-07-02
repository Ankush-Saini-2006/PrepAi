import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/common/Spinner";

/**
 * Wraps any route that requires authentication.
 * Redirects unauthenticated users to /login, preserving the intended location
 * in state so they can be redirected back after login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
