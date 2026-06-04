// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
