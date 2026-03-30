import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import "../assets/css/adminSidebar.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminSidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll unread message count every 60 seconds
  // Clear badge immediately when on the messages page
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        // If already on messages page, just clear and skip the fetch
        if (location.pathname.startsWith("/admin/messages")) {
          setUnreadCount(0);
          return;
        }
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${BASE_URL}/api/messages/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch { /* silent */ }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ),
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zm1 1h10l2.5 3H4.5L7 3zM5 7h14v13H5V7zm5 2v2H8v2h2v2h2v-2h2v-2h-2V9h-2z"/>
        </svg>
      ),
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
        </svg>
      ),
    },
    {
      to: "/admin/users",
      label: "Users",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
    },
    {
      to: "/admin/categories",
      label: "Categories",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6.5l-4-4H7L3 6.5l3 2.25V20h12V8.75L21 6.5zM9 4h6l2.5 2.5-1.75 1.3A3 3 0 0112 9a3 3 0 01-3.75-1.2L6.5 6.5 9 4zm3 7a1 1 0 110 2 1 1 0 010-2z"/>
        </svg>
      ),
    },
    {
      to: "/admin/newarrivals",
      label: "New Arrivals",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 17.657a9 9 0 010-12.728M9.172 15.536a5 5 0 010-7.072M12 13a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
      ),
    },
    {
      to: "/admin/sales-report",
      label: "Sales Report",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3v18h18M9 17V9m4 8v-5m4 5V5"/>
        </svg>
      ),
    },
    {
      to: "/admin/shipping",
      label: "Shipping",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
      ),
    },
  ];

  const toolItems = [
    {
      to: "/admin/inventory",
      label: "Inventory",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      ),
    },
    {
      to: "/admin/coupons",
      label: "Coupons",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
        </svg>
      ),
    },
    {
      to: "/admin/messages",
      label: "Messages",
      badge: unreadCount,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="kcee-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">Kcee_Collection</div>

      {/* User info */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div className="sidebar-user-info">
          <div className="name">{user?.name || "Admin"}</div>
          <div className="status">Online</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Main Navigation</div>

        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${isActive(item.to) ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* Tools section */}
        <div className="sidebar-nav-label" style={{ marginTop: "8px" }}>Tools</div>

        {toolItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${isActive(item.to) ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
            {item.badge > 0 && (
              <span className="sidebar-unread-badge">{item.badge}</span>
            )}
          </Link>
        ))}

        <div style={{ flex: 1 }} />

        {/* Logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Logout
        </button>
      </nav>
    </div>
  );
}
