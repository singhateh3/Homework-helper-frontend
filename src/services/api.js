import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return "http://127.0.0.1:8000/api"; // Use 127.0.0.1 not localhost
  }
  return import.meta.env.VITE_API_URL || "https://your-laravel.com/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS
});

// Request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
