import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHeroSearch } from "../hooks/useHeroSearch";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import crown from "../assets/Icons/crown.png";
import loginImg from "../assets/Icons/user2.png";
import Toast from "./Toast";
import "../assets/css/style.css";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    searchWrapperRef,
    searchInputRef,
    voiceIconRef,
    searchToggleIconRef,
    dropdownRef: searchDropdownRef,
    results,
    showDropdown,
    searching,
    handleResultClick,
  } = useHeroSearch();

  const handleShopClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#shop");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    logout();
    navigate("/");
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="nav">
      <Toast />

      <Link to="/" className="brand">
        <h1>KceeCollection</h1>
        <img src={crown} alt="Kceecollection Crown Icon" className="crown"
          style={{ width: "15px", height: "15px" }} />
      </Link>

      <div className="nav-center" style={{ position: "relative" }}>
        <i className="fa-solid fa-magnifying-glass search-toggle-icon" ref={searchToggleIconRef}></i>
        <div className="search-wrapper" ref={searchWrapperRef}>
          <input
            type="text"
            className="search"
            placeholder="Search KceeCollection..."
            ref={searchInputRef}
          />
          <span className="voice-icon" ref={voiceIconRef} role="button" aria-label="Voice search">🎙️</span>
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div ref={searchDropdownRef} style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: 5,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            zIndex: 9999,
            overflow: "hidden",
            minWidth: 280,
          }}>
            {searching ? (
              <div style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#9ca3af" }}>
                Searching...
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleResultClick(product)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                >
                  {product.image && (
                    <img src={product.image} alt={product.name} style={{
                      width: 40, height: 40, objectFit: "cover", borderRadius: 3, flexShrink: 0,
                    }} />
                  )}
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {product.category} · ₦{product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <nav className="menu-items">
        <a href="#shop" onClick={handleShopClick}>
          <span className="menu-icon"><i className="fa-solid fa-shop"></i></span>
          <span className="menu-text">Shop</span>
        </a>
        <a href="#contact">
          <span className="menu-icon"><i className="fa-solid fa-address-book"></i></span>
          <span className="menu-text">Contact</span>
        </a>
        <Link to="/cart" className="cart-btn">
          <span className="menu-icon">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-badge">{totalItems}</span>
          </span>
        </Link>

        {isLoggedIn ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#3A9D23", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
                {initial}
              </span>
              <span className="menu-text" style={{ color: "#3A9D23", fontWeight: "600" }}>
                {firstName}
              </span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: "10px", color: "#3A9D23", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}></i>
            </button>

            {dropdownOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 10px)", right: -20, background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", minWidth: "210px", zIndex: 9999, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#3A9D23", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", flexShrink: 0 }}>{initial}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{user?.name || "User"}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{user?.email || ""}</div>
                    </div>
                  </div>
                </div>

                {[
                  { to: "/dashboard", icon: "fa-gauge", label: "Dashboard" },
                  { to: "/orders", icon: "fa-box", label: "My Orders" },
                  { to: "/profile", icon: "fa-user-pen", label: "Profile Settings" },
                ].map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "13px", color: "#374151", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#3A9D23"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
                  >
                    <i className={`fa-solid ${item.icon}`} style={{ width: "16px", color: "#9ca3af", fontSize: "13px" }}></i>
                    {item.label}
                  </Link>
                ))}

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
        ) : (
          <Link to="/auth">
            <img src={loginImg} alt="Login Icon" className="user-icon" />
            <span className="menu-text">Login</span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
