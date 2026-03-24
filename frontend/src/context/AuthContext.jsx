import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { authService, userService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchProfile = async () => {
    try {
      const response = await userService.profile();
      setUser(response.data.data);
    } catch {
      setUser((current) => current);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authRoutes = ["/login", "/register"];
    if (authRoutes.includes(location.pathname)) {
      setLoading(false);
      return;
    }
    if (user) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [location.pathname, user]);

  const login = async (payload) => {
    const response = await authService.login(payload);
    await fetchProfile();
    return response.data;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    await fetchProfile();
    return response.data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshProfile = fetchProfile;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
