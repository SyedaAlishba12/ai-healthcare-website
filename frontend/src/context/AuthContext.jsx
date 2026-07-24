import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getProfile(token);
        setUser(data.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);

    localStorage.setItem("token", data.token);

    setToken(data.token);

    setUser(data.user);

    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);

    localStorage.setItem("token", data.token);

    setToken(data.token);

    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);