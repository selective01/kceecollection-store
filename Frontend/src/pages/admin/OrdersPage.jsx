import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ for modal

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      await axios.put(`${BASE_URL}/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  // ✅ Format date with time
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    }) + " " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
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
                {/* ✅ Show user name from customer field */}
                <td>{order.customer?.fullName || "N/A"}</td>
                <td>₦{(order.totalPrice || 0).toLocaleString()}</td>
                <td>{order.status || "Pending"}</td>
                {/* ✅ Date with time */}
                <td>{formatDate(order.createdAt)}</td>
                {/* ✅ Shipping details button */}
                <td>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      backgroundColor: "#1d4ed8",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Shipping
                  </button>
                </td>
                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
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

      {/* ✅ Shipping Details Modal */}
      {selectedOrder && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "8px",
            padding: "30px", minWidth: "350px", maxWidth: "500px", width: "90%",
            position: "relative",
          }}>
            {/* Close button */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute", top: "10px", right: "15px",
                background: "none", border: "none", fontSize: "1.5rem",
                cursor: "pointer", color: "#333",
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: "20px" }}>Shipping Details</h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={labelStyle}>Customer</td>
                  <td style={valueStyle}>{selectedOrder.customer?.fullName || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Email</td>
                  <td style={valueStyle}>{selectedOrder.customer?.email || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Phone</td>
                  <td style={valueStyle}>{selectedOrder.customer?.phone || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Address</td>
                  <td style={valueStyle}>{selectedOrder.customer?.address || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>City</td>
                  <td style={valueStyle}>{selectedOrder.customer?.state || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Country</td>
                  <td style={valueStyle}>{selectedOrder.customer?.country || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Postal Code</td>
                  <td style={valueStyle}>{selectedOrder.customer?.postalCode || "N/A"}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Order Date</td>
                  <td style={valueStyle}>{formatDate(selectedOrder.createdAt)}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Total</td>
                  <td style={valueStyle}>₦{(selectedOrder.totalPrice || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Payment</td>
                  <td style={valueStyle}>{selectedOrder.paymentStatus || "N/A"}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                marginTop: "20px", width: "100%", padding: "10px",
                backgroundColor: "#1a1a1a", color: "#fff",
                border: "none", cursor: "pointer", borderRadius: "4px",
                fontSize: "1rem",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ Table cell styles for modal
const labelStyle = {
  fontWeight: "bold", padding: "8px 10px",
  borderBottom: "1px solid #eee", width: "40%", color: "#555",
};

const valueStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid #eee",
};
