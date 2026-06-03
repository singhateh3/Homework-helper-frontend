import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
