import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedAdmin() {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for auth to resolve

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}