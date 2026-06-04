import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/register", formData);
      console.log(response.data);

      // Assuming your API returns a token after registration
      // Adjust based on your Laravel API response structure
      const token = response.data.token || response.data.access_token;

      if (token) {
        // Log the user in automatically after registration
        login(token);
        navigate("/"); // Redirect to home page
      } else {
        // If no token, just redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error(error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        if (error.response.status === 422) {
          // Validation errors
          const errors = error.response.data.errors;
          if (errors) {
            // Get first error message
            const firstError = Object.values(errors)[0];
            setError(Array.isArray(firstError) ? firstError[0] : firstError);
          } else {
            setError(error.response.data.message || "Validation failed");
          }
        } else if (error.response.status === 409) {
          setError("Email already exists");
        } else {
          setError(
            error.response.data?.message ||
              "Registration failed. Please try again.",
          );
        }
      } else if (error.request) {
        // Request made but no response
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
