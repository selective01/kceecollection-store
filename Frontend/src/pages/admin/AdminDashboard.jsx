import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/adminDashboard.css"

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/orders`, { headers }),
          axios.get(`${BASE_URL}/api/auth`, { headers }),
        ]);

        const ordersData = ordersRes.data || [];
        const usersData = usersRes.data || [];

        setOrders(ordersData);
        setUsers(usersData);
        setRevenue(ordersData.reduce((acc, o) => acc + (o.totalPrice || 0), 0));
        setPendingOrders(ordersData.filter((o) => o.status === "Pending").length);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: orders.length,
      bg: "#1d4ed8",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
    },
    {
      label: "Total Revenue",
      value: `₦${revenue.toLocaleString()}`,
      bg: "#16a34a",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
    },
    {
      label: "Total Users",
      value: users.length,
      bg: "#dc2626",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      bg: "#d97706",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="dash-wrapper">
        {/* Top bar */}
        <div className="dash-topbar">
          <h1>Dashboard</h1>
          <div className="dash-breadcrumb">
            🏠 Home &rsaquo; <span>Dashboard</span>
          </div>
        </div>

        {loading && <div className="dash-loading">Loading dashboard...</div>}
        {error && <div className="dash-error">Error: {error}</div>}

        {!loading && !error && (
          <>
            {/* Stat Cards */}
            <div className="dash-cards">
              {cards.map((card, i) => (
                <div key={i} className="dash-card" style={{ background: card.bg }}>
                  <div className="dash-card-body">
                    <div>
                      <div className="dash-card-value">{card.value}</div>
                      <div className="dash-card-label">{card.label}</div>
                    </div>
                    <div className="dash-card-icon">{card.icon}</div>
                  </div>
                  <div className="dash-card-footer">
                    More info
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="dash-recent">
              <div className="dash-recent-header">Recent Orders</div>
              {orders.length === 0 ? (
                <div style={{ padding: "20px 16px", color: "#6b7280", fontSize: "0.85rem" }}>
                  No orders yet.
                </div>
              ) : (
                <table className="dash-recent-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>{order.customer?.fullName || "N/A"}</td>
                        <td>₦{(order.totalPrice || 0).toLocaleString()}</td>
                        <td>
                          <span className={`dash-badge badge-${(order.status || "pending").toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
