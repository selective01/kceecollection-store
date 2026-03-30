// Userdashboard.tsx — Overview content only
// Sidebar is now handled by UserLayout
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/format";
import "../../assets/css/userdashboard.css";

interface Order {
  _id: string;
  reference: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
}

interface User {
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "ud-badge ud-pending",
    processing: "ud-badge ud-processing",
    shipped: "ud-badge ud-shipped",
    delivered: "ud-badge ud-delivered",
    cancelled: "ud-badge ud-cancelled",
    paid: "ud-badge ud-paid",
    unpaid: "ud-badge ud-unpaid",
  };
  return map[status?.toLowerCase()] ?? "ud-badge ud-pending";
};

const getInitials = (name: string) =>
  name?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";

export default function Userdashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/auth"); return; }
    setUser(JSON.parse(stored));

    get<Order[]>("/api/orders/my")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const totalSpent = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const delivered = orders.filter((o) => o.status?.toLowerCase() === "delivered").length;
  const pending = orders.filter((o) => o.status?.toLowerCase() === "pending").length;

  return (
    <div className="ud-main">
      {/* Top bar */}
      <header className="ud-topbar">
        <div>
          <h1 className="ud-topbar-title">Dashboard</h1>
          <p className="ud-topbar-sub">
            Welcome back, <strong>{user?.name?.split(" ")[0] || "..."}</strong>
          </p>
        </div>
        <Link to="/" className="ud-shop-cta">
          <i className="fas fa-shopping-bag" />
          Shop Now
        </Link>
      </header>

      <div className="ud-overview">
        {/* Stat cards */}
        <div className="ud-stats-row">
          <div className="ud-stat-card ud-stat-green">
            <div className="ud-stat-icon-wrap"><i className="fas fa-shopping-bag" /></div>
            <div>
              <p className="ud-stat-val">{orders.length}</p>
              <p className="ud-stat-lbl">Total Orders</p>
            </div>
          </div>
          <div className="ud-stat-card ud-stat-blue">
            <div className="ud-stat-icon-wrap"><i className="fas fa-naira-sign" /></div>
            <div>
              <p className="ud-stat-val">{formatCurrency(totalSpent)}</p>
              <p className="ud-stat-lbl">Total Spent</p>
            </div>
          </div>
          <div className="ud-stat-card ud-stat-purple">
            <div className="ud-stat-icon-wrap"><i className="fas fa-check-circle" /></div>
            <div>
              <p className="ud-stat-val">{delivered}</p>
              <p className="ud-stat-lbl">Delivered</p>
            </div>
          </div>
          <div className="ud-stat-card ud-stat-orange">
            <div className="ud-stat-icon-wrap"><i className="fas fa-clock" /></div>
            <div>
              <p className="ud-stat-val">{pending}</p>
              <p className="ud-stat-lbl">Pending</p>
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="ud-two-col">
          {/* Recent orders */}
          <div className="ud-card">
            <div className="ud-card-head">
              <p className="ud-card-title">Recent Orders</p>
              <Link to="/orders" className="ud-text-btn">View all →</Link>
            </div>
            {loading ? (
              <div className="ud-loading">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="ud-empty-state">
                <i className="fas fa-box-open" />
                <p>No orders yet</p>
                <Link to="/" className="ud-link-btn">Start shopping</Link>
              </div>
            ) : (
              <div className="ud-order-list">
                {orders.slice(0, 5).map((o) => (
                  <div className="ud-order-row" key={o._id}>
                    <div className="ud-order-icon-wrap">
                      <i className="fas fa-box" />
                    </div>
                    <div className="ud-order-info">
                      <p className="ud-order-ref">
                        #{o.reference?.slice(-8).toUpperCase() || o._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="ud-order-date">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="ud-order-right">
                      <p className="ud-order-amt">{formatCurrency(o.totalPrice)}</p>
                      <span className={statusBadge(o.status)}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="ud-right-col">
            {/* Account summary */}
            <div className="ud-card ud-account-card">
              <div className="ud-card-head">
                <p className="ud-card-title">Account</p>
              </div>
              <div className="ud-account-avatar-row">
                <div className="ud-account-avatar">
                  {user ? getInitials(user.name) : "?"}
                </div>
                <div>
                  <p className="ud-account-name">{user?.name}</p>
                  <span className="ud-member-badge">
                    <i className="fas fa-circle" /> Member
                  </span>
                </div>
              </div>
              <div className="ud-info-list">
                <div className="ud-info-row">
                  <span className="ud-info-lbl">Email</span>
                  <span className="ud-info-val">{user?.email}</span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-lbl">Phone</span>
                  <span className="ud-info-val">{user?.phone || "—"}</span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-lbl">Member since</span>
                  <span className="ud-info-val">
                    {user?.createdAt ? formatDate(user.createdAt) : "—"}
                  </span>
                </div>
              </div>
              <Link to="/profile" className="ud-edit-profile-btn">
                Edit Profile
              </Link>
            </div>

            {/* Quick actions */}
            <div className="ud-card">
              <div className="ud-card-head">
                <p className="ud-card-title">Quick Actions</p>
              </div>
              <div className="ud-quick-actions">
                <Link to="/cart"     className="ud-action-tile ud-action-green">
                  <i className="fas fa-shopping-cart" /><span>View Cart</span>
                </Link>
                <Link to="/checkout" className="ud-action-tile ud-action-blue">
                  <i className="fas fa-credit-card" /><span>Checkout</span>
                </Link>
                <Link to="/orders"   className="ud-action-tile ud-action-purple">
                  <i className="fas fa-box" /><span>Orders</span>
                </Link>
                <Link to="/profile"  className="ud-action-tile ud-action-orange">
                  <i className="fas fa-cog" /><span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
