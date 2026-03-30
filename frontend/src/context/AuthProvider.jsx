// AuthProvider.jsx — only exports the AuthProvider component
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      if (!res.data.token) throw new Error("No token returned");
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      throw err.response?.data?.msg || err.message || "Login failed";
    }
  };

  const register = async (name, email, password, phone = "") => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, phone });
      if (!res.data.token) throw new Error("No token returned");
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      throw err.response?.data?.msg || err.message || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.msg || err.message || "Failed to send reset email";
    }
  };

  const updateUser = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, forgotPassword, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
