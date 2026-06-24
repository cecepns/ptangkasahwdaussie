import { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    get(API_ENDPOINTS.AUTH.PROFILE).then((result) => {
      if (result.success && result.data?.success) {
        setAdmin(result.data.data);
        localStorage.setItem("admin_user", JSON.stringify(result.data.data));
      } else {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setAdmin(null);
      }
      setLoading(false);
    });
  }, []);

  const login = async (username, password) => {
    const result = await post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
    if (!result.success || !result.data?.success) {
      return { success: false, error: result.error || result.data?.message || "Login failed" };
    }
    const { token, admin: adminData } = result.data.data;
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(adminData));
    setAdmin(adminData);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
