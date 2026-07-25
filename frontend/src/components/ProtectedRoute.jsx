import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!token) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    );

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;