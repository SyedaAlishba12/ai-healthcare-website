import { useState } from "react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess(response.message);
        setEmail("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send reset request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-lightBg px-4">

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-dark">
          Forgot Password
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Enter your registered email to request a password reset.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 rounded-lg p-3 mb-5 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 rounded-lg p-3 mb-5 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            {loading
              ? "Sending..."
              : "Send Reset Request"}
          </Button>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;