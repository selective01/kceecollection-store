import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setOpen(false);
    logout();
    navigate("/");
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#3A9D23", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
          {initial}
        </span>
        <span style={{ fontSize: "13px", color: "#3A9D23", fontWeight: "600" }}>{firstName}</span>
        <i className="fa-solid fa-chevron-down" style={{ fontSize: "10px", color: "#3A9D23", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}></i>
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", minWidth: "210px", zIndex: 9999, overflow: "hidden", borderRadius: "8px" }}>
          {/* User info header */}
          <div style={{ padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#3A9D23", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", flexShrink: 0 }}>{initial}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{user?.email || ""}</div>
              </div>
            </div>
          </div>

          {/* Nav links */}
          {[
            { to: "/", icon: "fa-house", label: "Home" },
            { to: "/dashboard", icon: "fa-gauge", label: "Dashboard" },
            { to: "/orders", icon: "fa-box", label: "My Orders" },
            { to: "/profile", icon: "fa-user-pen", label: "Profile Settings" },
          ].map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "13px", color: "#374151", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#3A9D23"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
            >
              <i className={`fa-solid ${item.icon}`} style={{ width: "16px", color: "#9ca3af", fontSize: "13px" }}></i>
              {item.label}
            </Link>
          ))}

          {/* Logout */}
          <a href="#" onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "13px", color: "#dc2626", textDecoration: "none", fontWeight: "500", transition: "background 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: "16px", fontSize: "13px" }}></i>
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
