// Navbar.jsx — avatar-aware: shows profile photo if set, falls back to initial
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import UserAvatar from "./UserAvatar";
import Toast from "./Toast";
import "../assets/css/style.css";
import "../assets/css/navbar.css";

const Navbar = () => {
  const { totalItems }   = useCart();
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [menuPath,     setMenuPath]     = useState(null);
  const [searchPath,   setSearchPath]   = useState(null);
  const [dropdownPath, setDropdownPath] = useState(null);

  const menuOpen     = menuPath     === location.pathname;
  const showSearch   = searchPath   === location.pathname;
  const dropdownOpen = dropdownPath === location.pathname;

  const setMenuOpen     = (open) => setMenuPath    (open ? location.pathname : null);
  const setShowSearch   = (open) => setSearchPath  (open ? location.pathname : null);
  const setDropdownOpen = (open) => setDropdownPath(open ? location.pathname : null);

  const [search,   setSearch]   = useState("");
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownPath(null); // close dropdown directly — no derived setter needed
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []); // ✅ setDropdownPath from useState is stable, no dependency needed

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const handleShopClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#shop");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowSearch(false);
    setSearch("");
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <>
      <Toast />

      {/* ── MAIN NAV ── */}
      <div className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <Link to="/" className="brand">
          <h1>Kcee_Collection</h1>
        </Link>

        <div className="nav-center">
          <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
            <i className="fa-solid fa-magnifying-glass nav-search-bar-ico" />
            <input
              className="nav-search-bar-input"
              type="text"
              placeholder="Search Kcee_Collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button className="nav-search-mobile-btn" onClick={() => setShowSearch(true)} aria-label="Search">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>

        <nav className="menu-items">
          <a href="#shop" className="nav-desktop-link" onClick={handleShopClick}>
            <span className="menu-icon"><i className="fa-solid fa-shop" /></span>
            <span className="menu-text">Shop</span>
          </a>
          <Link to="/contact" className="nav-desktop-link">
            <span className="menu-icon"><i className="fa-solid fa-address-book" /></span>
            <span className="menu-text">Contact</span>
          </Link>

          <Link to="/cart" className="cart-btn">
            <span className="menu-icon cart-icon">
              <i className="fa-solid fa-cart-shopping" />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </span>
          </Link>

          {/* ── DESKTOP: user dropdown ── */}
          {!user ? (
            <Link to="/auth" className="nav-desktop-only nav-login-link">
              <span className="menu-icon"><i className="fa-regular fa-user" /></span>
              <span className="menu-text">Login</span>
            </Link>
          ) : (
            <div className="profile-dropdown-wrap nav-desktop-only" ref={dropdownRef}>
              <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {/* ✅ UserAvatar: photo or initial */}
                <UserAvatar
                  avatar={user.avatar}
                  name={user.name}
                  size={30}
                  style={{ border: "2px solid var(--design-color)" }}
                />
                <span className="menu-text" style={{ color: "var(--design-color)", fontWeight: 600 }}>
                  {firstName}
                </span>
                <i className={`fa-solid fa-chevron-down profile-chevron ${dropdownOpen ? "open" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    {/* ✅ Larger avatar in dropdown header */}
                    <UserAvatar
                      avatar={user.avatar}
                      name={user.name}
                      size={40}
                      style={{ border: "2px solid #eee" }}
                    />
                    <div>
                      <div className="profile-dropdown-name">{user.name}</div>
                      <div className="profile-dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider" />
                  {[
                    { to: "/",         icon: "fa-house",    label: "Home"             },
                    { to: "/orders",   icon: "fa-box",      label: "My Orders"        },
                    { to: "/wishlist", icon: "fa-heart",    label: "Wishlist"         },
                    { to: "/profile",  icon: "fa-user-pen", label: "Profile Settings" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="profile-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className={`fa-solid ${item.icon}`} />
                      {item.label}
                    </Link>
                  ))}
                  <div className="profile-dropdown-divider" />
                  <button className="profile-dropdown-item logout" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── MOBILE: hamburger ── */}
          <button
            className={`nav-hamburger nav-mobile-only ${menuOpen ? "nav-hamburger-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      {/* ── SEARCH OVERLAY ── */}
      {showSearch && (
        <div className="nav-search-overlay" onClick={() => setShowSearch(false)}>
          <form className="nav-search-form" onSubmit={handleSearchSubmit} onClick={(e) => e.stopPropagation()}>
            <i className="fa-solid fa-magnifying-glass nav-search-ico" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search Kcee_Collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="nav-search-input"
            />
            <button type="button" className="nav-search-close" onClick={() => setShowSearch(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </form>
        </div>
      )}

      {/* ── MOBILE BACKDROP ── */}
      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* ── MOBILE DRAWER ── */}
      <div className={`nav-drawer ${menuOpen ? "nav-drawer-open" : ""}`}>
        <div className="nav-drawer-head">
          <span className="nav-drawer-brand">Kcee_Collection</span>
          <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {user && (
          <div className="nav-drawer-user">
            {/* ✅ Avatar in mobile drawer */}
            <UserAvatar
              avatar={user.avatar}
              name={user.name}
              size={44}
              style={{ border: "2px solid #eee" }}
            />
            <div>
              <p className="nav-drawer-uname">{user.name}</p>
              <p className="nav-drawer-uemail">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="nav-drawer-nav">
          <Link to="/"        className="nav-drawer-link"><i className="fa-solid fa-house" />Home</Link>
          <a href="#shop"     className="nav-drawer-link" onClick={handleShopClick}><i className="fa-solid fa-shop" />Shop</a>
          <Link to="/contact" className="nav-drawer-link"><i className="fa-solid fa-address-book" />Contact</Link>
          <Link to="/cart"    className="nav-drawer-link">
            <i className="fa-solid fa-cart-shopping" />Cart
            {totalItems > 0 && <span className="nav-drawer-badge">{totalItems}</span>}
          </Link>
        </nav>

        <div className="nav-drawer-divider" />

        {user ? (
          <nav className="nav-drawer-nav">
            <Link to="/orders"   className="nav-drawer-link"><i className="fa-solid fa-box" />My Orders</Link>
            <Link to="/wishlist" className="nav-drawer-link"><i className="fa-regular fa-heart" />Wishlist</Link>
            <Link to="/profile"  className="nav-drawer-link"><i className="fa-solid fa-user-pen" />Profile</Link>
            <button className="nav-drawer-logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" />Logout
            </button>
          </nav>
        ) : (
          <div style={{ padding: "16px 20px" }}>
            <Link to="/auth" className="nav-drawer-auth-btn">Login / Sign Up</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
