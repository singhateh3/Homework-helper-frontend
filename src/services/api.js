import axios from "axios";

// Force localhost in development
const getBaseURL = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return "http://127.0.0.1:8000/api";
  }

  // Production: use environment variable or fallback
  return import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;

      // Only redirect to login if not already there
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
