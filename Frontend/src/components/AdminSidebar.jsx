import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-sidebar">
      <h2>KCEE Admin</h2>

      <nav>
        <Link to="/admin" className={isActive("/admin") ? "active-link" : ""}>
          Dashboard
        </Link>
        <Link to="/admin/orders" className={isActive("/admin/orders") ? "active-link" : ""}>
          Orders
        </Link>
        <Link to="/admin/products" className={isActive("/admin/products") ? "active-link" : ""}>
          Products
        </Link>
        <Link to="/admin/users" className={isActive("/admin/users") ? "active-link" : ""}>
          Users
        </Link>

        {/* ✅ Logout button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            backgroundColor: "red",
            color: "#fff",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}