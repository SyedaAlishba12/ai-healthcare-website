import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.success) {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-lightBg px-4">
      <div className="bg-white shadow-lg rounded-3xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-dark">
          Create Account
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Join HealthPulse and manage your healthcare digitally.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 rounded-lg p-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="text"
            placeholder="03XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="relative">

            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-sm font-medium text-primary hover:text-primary-dark"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <div className="relative">

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[42px] text-sm font-medium text-primary hover:text-primary-dark"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>

          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            <>
              {loading && (
                <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}

              {loading ? "Creating Account..." : "Register"}
            </>
          </Button>

        </form>

        <div className="text-center mt-6 text-sm">

          <span className="text-slate-600">
            Already have an account?{" "}
          </span>

          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Register;