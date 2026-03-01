import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "../../assets/css/userdashboard.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    fetchOrders();
  }, [user, loading]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const lastOrder = orders[0];
  const recentOrders = orders.slice(0, 5);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "N/A";

  return (
    <>
      <div className="ud-wrap">

        {/* Header */}
        <div className="ud-header">
          <div>
            <h1 className="ud-welcome">Welcome back, {user?.name?.split(" ")[0] || "User"}</h1>
            <p className="ud-subtext">Here's a summary of your account activity</p>
          </div>
          <Link to="/" title="Homepage" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 38, height: 38, borderRadius: "50%",
            background: "#f0fdf4", color: "#3A9D23",
            textDecoration: "none", transition: "background 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#dcfce7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f0fdf4"}
          >
            <i className="fa-solid fa-house" style={{ fontSize: 15 }}></i>
          </Link>
        </div>

        {/* Stats */}
        <div className="ud-stats">
          <div className="ud-stat-card">
            <div className="ud-stat-icon green"><i className="fa-solid fa-box"></i></div>
            <div>
              <div className="ud-stat-value">{orders.length}</div>
              <div className="ud-stat-label">Total Orders</div>
            </div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-icon blue"><i className="fa-solid fa-naira-sign"></i></div>
            <div>
              <div className="ud-stat-value">₦{totalSpent.toLocaleString()}</div>
              <div className="ud-stat-label">Total Spent</div>
            </div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-icon orange"><i className="fa-solid fa-truck"></i></div>
            <div>
              <div className="ud-stat-value" style={{ fontSize: "0.95rem" }}>
                {lastOrder ? lastOrder.status || "Pending" : "—"}
              </div>
              <div className="ud-stat-label">Last Order Status</div>
            </div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-icon purple"><i className="fa-solid fa-calendar"></i></div>
            <div>
              <div className="ud-stat-value" style={{ fontSize: "0.9rem" }}>{memberSince}</div>
              <div className="ud-stat-label">Member Since</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="ud-grid">

          {/* Recent Orders */}
          <div className="ud-card">
            <div className="ud-card-header">
              <h2 className="ud-card-title">Recent Orders</h2>
              <Link to="/orders" className="ud-view-all">View all →</Link>
            </div>
            {ordersLoading ? (
              <div className="ud-empty">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="ud-empty">
                <i className="fa-solid fa-box-open" style={{ fontSize: "2rem", marginBottom: "8px", display: "block", color: "#d1d5db" }}></i>
                No orders yet. <Link to="/" style={{ color: "#3A9D23" }}>Start shopping</Link>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div className="ud-order-row" key={order._id}>
                  <div>
                    <div className="ud-order-ref">#{order.reference || order._id?.slice(-8).toUpperCase()}</div>
                    <div className="ud-order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className={`ud-badge ${order.paymentStatus?.toLowerCase() === "paid" ? "paid" : "pending"}`}>
                      {order.paymentStatus || "Pending"}
                    </span>
                    <span className={`ud-badge ${order.status?.toLowerCase() || "pending"}`}>
                      {order.status || "Pending"}
                    </span>
                    <span className="ud-order-amount">₦{(order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Quick Links */}
            <div className="ud-card">
              <div className="ud-card-header">
                <h2 className="ud-card-title">Quick Links</h2>
              </div>
              <div className="ud-quick-links">
                <Link to="/orders" className="ud-quick-link">
                  <i className="fa-solid fa-box green"></i> My Orders
                </Link>
                <Link to="/profile" className="ud-quick-link">
                  <i className="fa-solid fa-user-pen blue"></i> Edit Profile
                </Link>
                <Link to="/" className="ud-quick-link">
                  <i className="fa-solid fa-shop orange"></i> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="ud-card">
              <div className="ud-card-header">
                <h2 className="ud-card-title">Account Info</h2>
              </div>
              <div className="ud-account-info">
                <div className="ud-info-row">
                  <span className="ud-info-label">Name</span>
                  <span className="ud-info-value">{user?.name || "—"}</span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-label">Email</span>
                  <span className="ud-info-value" style={{ fontSize: "0.78rem" }}>{user?.email || "—"}</span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-label">Status</span>
                  <span className="ud-info-value">
                    <span className="ud-status-dot"></span>Active
                  </span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-label">Member Since</span>
                  <span className="ud-info-value">{memberSince}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
