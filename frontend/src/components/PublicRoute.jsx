import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (token) {
    const redirect = sessionStorage.getItem("redirectAfterLogin");

    if (redirect) {
      return <Navigate to={redirect} replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;