import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("campusevents_token"));
  const [loading, setLoading] = useState(true);
  const refreshUser = async () => {
    const currentToken = localStorage.getItem("campusevents_token");
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn("Session expired or invalid, logging out.");
      logout();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshUser();
  }, []);
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("campusevents_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || "Login failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed. Please check your credentials."
      };
    }
  };
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      if (res.data.success) {
        localStorage.setItem("campusevents_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || "Registration failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed."
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("campusevents_token");
    setToken(null);
    setUser(null);
  };
  const updateProfile = async (data) => {
    try {
      const res = await api.put("/users/profile", data);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true, message: "Profile updated successfully!" };
      }
      return { success: false, message: res.data.message || "Update failed" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Update failed." };
    }
  };
  const quickLoginDemo = async (role) => {
    const email = role === "student" ? "rahul@college.edu" : "anita@college.edu";
    await login(email, "password123");
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        quickLoginDemo,
        refreshUser
      },
      children
    }
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
