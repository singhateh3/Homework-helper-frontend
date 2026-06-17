import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        console.log("Auth initialized - User:", parsedUser);
      } catch (error) {
        console.error("Failed to parse user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    console.log("Login called with:", { newToken, userData });

    // Store token and user
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Update state
    setUser(userData);

    // Set axios default header
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

    console.log("Login complete - user state set");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  };

  // Compute isAuthenticated from user state
  const isAuthenticated = !!user; // This is key - check if user exists

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
