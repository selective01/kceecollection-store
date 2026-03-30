// UserLayout.tsx — Jumia-style sidebar layout with KceeCollection design colors
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

interface User {
  name: string;
  email: string;
}

const getInitials = (name: string) =>
  name?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";

const NAV_ITEMS = [
  { to: "/orders",   icon: "fa-box",          label: "My Orders"  },
  { to: "/wishlist", icon: "fa-heart",         label: "Wishlist"   },
  { to: "/profile",  icon: "fa-user",          label: "Profile"    },
  { to: "/",         icon: "fa-store",         label: "Shop"       },
  { to: "/cart",     icon: "fa-shopping-cart", label: "Cart"       },
];

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser]         = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/auth"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const isActive = (to: string) => location.pathname === to;

  /* derive current page label for mobile bar */
  const activeLabel =
    NAV_ITEMS.find((i) => isActive(i.to))?.label ?? "My Account";

  return (
    <>
      <style>{`
        /* ─── SHELL ─────────────────────────────────── */
        .ul-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f5f5f5;
          font-family: inherit;
        }

        /* ─── BODY (below navbar) ────────────────────── */
        .ul-body {
          display: flex;
          flex: 1;
          max-width: 1280px;
          margin: 28px auto;
          width: 100%;
          padding: 0 20px;
          gap: 20px;
          align-items: flex-start;
          box-sizing: border-box;
        }

        /* ─── SIDEBAR ────────────────────────────────── */
        .ul-sidebar {
          width: 230px;
          flex-shrink: 0;
          background: var(--white-color, #fff);
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          position: sticky;
          top: 20px;
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(.4,0,.2,1);
        }

        /* ─── USER ROW ───────────────────────────────── */
        .ul-user-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 16px;
          border-bottom: 1px solid #f0f0f0;
          background: var(--design-color, #000);
        }
        .ul-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.4);
        }
        .ul-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        .ul-user-email {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 3px 0 0;
        }

        /* ─── NAV ────────────────────────────────────── */
        .ul-nav {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }
        .ul-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          text-decoration: none;
          color: #555;
          font-size: 13.5px;
          font-weight: 500;
          border-left: 3px solid transparent;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .ul-nav-item:hover {
          background: #fafafa;
          color: var(--design-color, #000);
        }
        .ul-nav-item:hover .ul-nav-icon {
          color: var(--design-color, #000);
        }
        .ul-nav-item.active {
          background: #f7f7f7;
          color: var(--design-color, #000);
          border-left-color: var(--design-color, #000);
          font-weight: 600;
        }
        .ul-nav-item.active .ul-nav-icon {
          color: var(--design-color, #000);
        }
        .ul-nav-icon {
          width: 16px;
          text-align: center;
          font-size: 13px;
          color: #bbb;
          flex-shrink: 0;
          transition: color 0.15s;
        }

        /* ─── DIVIDER ────────────────────────────────── */
        .ul-nav-divider {
          height: 1px;
          background: #f0f0f0;
          margin: 4px 0;
        }

        /* ─── LOGOUT ─────────────────────────────────── */
        .ul-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          font-family: inherit;
          color: #e53935;
          width: 100%;
          border-left: 3px solid transparent;
          transition: background 0.15s;
        }
        .ul-logout-btn:hover {
          background: #fff5f5;
        }
        .ul-logout-btn .ul-nav-icon {
          color: #e53935;
        }

        /* ─── MOBILE TOGGLE BAR ──────────────────────── */
        .ul-mobile-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: var(--white-color, #fff);
          border-bottom: 1px solid #efefef;
        }
        .ul-mobile-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--black-color, #111);
        }
        .ul-menu-btn {
          background: none;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: var(--black-color, #111);
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          font-weight: 500;
          padding: 6px 12px;
        }

        /* ─── OVERLAY ────────────────────────────────── */
        .ul-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 250;
        }
        .ul-overlay.open { display: block; }

        /* ─── MAIN CONTENT AREA ──────────────────────── */
        .ul-main {
          flex: 1;
          min-width: 0;
        }

        /* Boxed content panel — children (Orders, Wishlist etc.) sit inside */
        .ul-main > * {
          background: var(--white-color, #fff);
          border: 1px solid #e8e8e8;
          border-radius: 4px;
        }

        /* ─── RESPONSIVE ─────────────────────────────── */
        @media (max-width: 768px) {
          .ul-body {
            margin: 0;
            padding: 0;
            gap: 0;
            flex-direction: column;
          }
          .ul-mobile-bar { display: flex; }
          .ul-sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 260px;
            z-index: 300;
            border-radius: 0;
            border: none;
            transform: translateX(-100%);
            overflow-y: auto;
          }
          .ul-sidebar.open {
            transform: translateX(0);
            box-shadow: 6px 0 32px rgba(0,0,0,0.12);
          }
          .ul-main {
            padding: 0;
          }
          .ul-main > * {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>

      <div className="ul-shell">

        {/* ── SITE NAVBAR ── */}
        <Navbar />

        {/* ── MOBILE TOGGLE ── */}
        <div className="ul-mobile-bar">
          <span className="ul-mobile-label">{activeLabel}</span>
          <button className="ul-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} />
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* ── OVERLAY ── */}
        <div
          className={`ul-overlay ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        <div className="ul-body">

          {/* ── SIDEBAR ── */}
          <aside className={`ul-sidebar ${menuOpen ? "open" : ""}`}>

            {/* User banner */}
            <div className="ul-user-row">
              <div className="ul-avatar">
                {user ? getInitials(user.name) : "?"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <p className="ul-user-name">{user?.name || "..."}</p>
                <p className="ul-user-email">{user?.email || ""}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="ul-nav">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`ul-nav-item ${isActive(item.to) ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <i className={`fas ${item.icon} ul-nav-icon`} />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="ul-nav-divider" />

              {/* Logout */}
              <button className="ul-logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt ul-nav-icon" />
                <span>Logout</span>
              </button>
            </nav>

          </aside>

          {/* ── PAGE CONTENT ── */}
          <main className="ul-main">
            <Outlet />
          </main>

        </div>
      </div>
    </>
  );
}
