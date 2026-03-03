import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import UserDropdown from "../../components/UserDropdown";
import "../../assets/css/myorders.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MyOrders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }

    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user, loading, navigate]);

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

  const toggleExpand = (id) => setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });

  const filtered = orders.filter((o) =>
    (o.reference || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.status || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.paymentStatus || "").toLowerCase().includes(search.toLowerCase())
  );

  const getPaymentBadge = (status) => (status?.toLowerCase() === "paid" ? "paid" : "unpaid");
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "shipped") return "shipped";
    if (s === "delivered") return "delivered";
    return "pending";
  };

  return (
    <>
      <div className="mo-wrap">

        <div className="mo-header">
          <div>
            <h1 className="mo-title">My Orders</h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <UserDropdown />
        </div>

        {/* Search */}
        <div className="mo-search-bar">
          <i className="fa-solid fa-magnifying-glass" style={{ color: "#9ca3af", fontSize: "13px" }}></i>
          <input
            type="text"
            placeholder="Search by reference or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {ordersLoading ? (
          <div className="mo-empty"><p>Loading your orders...</p></div>
        ) : filtered.length === 0 ? (
          <div className="mo-empty">
            <i className="fa-solid fa-box-open"></i>
            <p>{search ? `No orders matching "${search}"` : "You haven't placed any orders yet."}</p>
            {!search && <Link to="/" className="mo-shop-btn">Start Shopping</Link>}
          </div>
        ) : (
          filtered.map((order) => (
            <div className="mo-order-card" key={order._id}>
              {/* Order Header */}
              <div className="mo-order-head">
                <div>
                  <div className="mo-order-ref">
                    #{order.reference || order._id?.slice(-8).toUpperCase()}
                  </div>
                  <div className="mo-order-date">{formatDate(order.createdAt)}</div>
                </div>
                <div className="mo-badges">
                  <span className={`mo-badge ${getPaymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus || "Unpaid"}
                  </span>
                  <span className={`mo-badge ${getStatusBadge(order.status)}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mo-items">
                {(expandedOrders[order._id] ? order.items : order.items?.slice(0, 2))?.map((item, i) => (
                  <div className="mo-item" key={i}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="mo-item-img" />
                      : <div className="mo-item-img-ph" />
                    }
                    <div>
                      <div className="mo-item-name">{item.name}</div>
                      <div className="mo-item-meta">
                        {item.size && `Size: ${item.size} · `}Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="mo-item-price">₦{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
                {order.items?.length > 2 && (
                  <button className="mo-toggle-btn" onClick={() => toggleExpand(order._id)}>
                    {expandedOrders[order._id]
                      ? "Show less ↑"
                      : `+${order.items.length - 2} more item${order.items.length - 2 > 1 ? "s" : ""} ↓`}
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="mo-order-foot">
                <span className="mo-total-label">Order Total</span>
                <span className="mo-total-amount">₦{(order.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
