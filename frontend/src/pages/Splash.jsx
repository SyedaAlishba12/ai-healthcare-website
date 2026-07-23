import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Splash = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigate("/");
      } else {
        navigate("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Logo */}
      <div className="w-28 h-28 rounded-full bg-primary text-white flex items-center justify-center text-5xl shadow-xl">
        🏥
      </div>

      {/* Website Name */}
      <h1 className="mt-8 text-4xl font-extrabold text-dark">
        HealthPulse
      </h1>

      <p className="mt-3 text-slate-500">
        AI-Powered Healthcare Platform
      </p>

      {/* Loading Spinner */}
      <div className="mt-10 flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.15s" }}
        ></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.3s" }}
        ></div>
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Loading...
      </p>

    </div>
  );
};

export default Splash;