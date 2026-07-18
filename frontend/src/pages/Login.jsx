import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.success) {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-lightBg px-4">
      <div className="bg-white shadow-lg rounded-3xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-dark">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Login to your healthcare account.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 rounded-lg p-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            {loading ? "Logging In..." : "Login"}
          </Button>

        </form>

        <div className="flex justify-between mt-6 text-sm">

          <Link
            to="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>

          <Link
            to="/register"
            className="text-primary hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Login;