import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/ordersPage.css"

const BASE_URL = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true); setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");
      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not load orders.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch { alert("Failed to update order status"); }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      + " " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <div className="ap">
        <div className="ap-topbar">
          <h1>Orders</h1>
          <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Orders</span></div>
        </div>

        <div className="ap-body">
          {loading && <p style={{ color: "#6b7280" }}>Loading orders...</p>}
          {error && <p style={{ color: "#dc2626" }}>Error: {error}</p>}

          {!loading && !error && (
            <div className="ap-card">
              {orders.length === 0 ? (
                <div className="ap-empty">No orders found.</div>
              ) : (
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Details</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.customer?.fullName || "N/A"}</td>
                        <td><strong>₦{(order.totalPrice || 0).toLocaleString()}</strong></td>
                        <td>
                          <span className={`sbadge s-${(order.status || "pending").toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          {formatDate(order.createdAt)}
                        </td>
                        {/* ✅ Details: View Order + Shipping side by side */}
                        <td>
                          <button className="btn-view" onClick={() => setSelectedOrder(order)}>
                            View Order
                          </button>
                          <button className="btn-ship" onClick={() => setSelectedShipping(order)}>
                            Shipping
                          </button>
                        </td>
                        <td>
                          <select className="ap-select" value={order.status || "Pending"}
                            onChange={(e) => updateStatus(order._id, e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shipping Modal */}
      {selectedShipping && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-x" onClick={() => setSelectedShipping(null)}>×</button>
            <h2>Shipping Details</h2>
            {[
              ["Customer", selectedShipping.customer?.fullName],
              ["Email", selectedShipping.customer?.email],
              ["Phone", selectedShipping.customer?.phone],
              ["Address", selectedShipping.customer?.address],
              ["City", selectedShipping.customer?.state],
              ["Country", selectedShipping.customer?.country],
              ["Postal Code", selectedShipping.customer?.postalCode],
              ["Order Date", formatDate(selectedShipping.createdAt)],
              ["Total", `₦${(selectedShipping.totalPrice || 0).toLocaleString()}`],
              ["Payment", selectedShipping.paymentStatus],
            ].map(([label, value]) => (
              <div className="modal-row" key={label}>
                <div className="modal-lbl">{label}</div>
                <div className="modal-val">{value || "N/A"}</div>
              </div>
            ))}
            <button className="modal-close-btn" onClick={() => setSelectedShipping(null)}>Close</button>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-x" onClick={() => setSelectedOrder(null)}>×</button>
            <h2>Order Details</h2>
            {[
              ["Customer", selectedOrder.customer?.fullName],
              ["Order Date", formatDate(selectedOrder.createdAt)],
              ["Payment Status", selectedOrder.paymentStatus],
              ["Order Status", selectedOrder.status],
              ["Reference", selectedOrder.reference],
            ].map(([label, value]) => (
              <div className="modal-row" key={label}>
                <div className="modal-lbl">{label}</div>
                <div className="modal-val">{value || "N/A"}</div>
              </div>
            ))}

            <div className="items-section">
              <h3>Items Ordered</h3>
              {(!selectedOrder.items || selectedOrder.items.length === 0) ? (
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No items found.</p>
              ) : (
                <>
                  {selectedOrder.items.map((item, i) => (
                    <div className="item-row" key={i}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className="item-img" />
                        : <div className="item-img-ph" />
                      }
                      <div className="item-info">
                        <div className="item-name">{item.name || "Unknown"}</div>
                        <div className="item-meta">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.quantity ? " · " : ""}
                          {item.quantity && `Qty: ${item.quantity}`}
                        </div>
                      </div>
                      <div className="item-price">
                        ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div className="total-row">
                    <span>Total</span>
                    <span>₦{(selectedOrder.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
