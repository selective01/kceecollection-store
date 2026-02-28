import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
  .ap { font-family: 'DM Sans', sans-serif; }
  .ap-topbar {
    background: #fff; padding: 16px 28px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #e5e7eb; margin-bottom: 28px;
  }
  .ap-topbar h1 { font-size: 1.4rem; font-weight: 600; color: #0f172a; letter-spacing: -0.3px; }
  .ap-breadcrumb { font-size: 0.82rem; color: #6b7280; }
  .ap-breadcrumb span { color: #1d4ed8; font-weight: 500; }
  .ap-body { padding: 0 28px 28px; }
  .ap-card { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; }
  .ap-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .ap-table th {
    background: #f8fafc; padding: 12px 16px; text-align: left;
    font-weight: 600; color: #6b7280; font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;
  }
  .ap-table td { padding: 13px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; vertical-align: middle; }
  .ap-table tr:last-child td { border-bottom: none; }
  .ap-table tr:hover td { background: #f8fafc; }
  .sbadge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
  .s-pending { background: #fef3c7; color: #92400e; }
  .s-paid { background: #d1fae5; color: #065f46; }
  .s-shipped { background: #dbeafe; color: #1e40af; }
  .s-delivered { background: #ede9fe; color: #5b21b6; }
  .btn-blue {
    background: #1d4ed8; color: #fff; border: none; padding: 6px 12px;
    border-radius: 6px; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s;
  }
  .btn-blue:hover { background: #1e40af; }
  .ap-select {
    border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 5px 8px;
    font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    color: #374151; background: #f9fafb; cursor: pointer; outline: none;
  }
  .ap-select:focus { border-color: #1d4ed8; }
  .ap-empty { padding: 40px; text-align: center; color: #9ca3af; font-size: 0.9rem; }
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.45); display: flex;
    align-items: center; justify-content: center; z-index: 1000;
  }
  .modal-box {
    background: #fff; border-radius: 12px; padding: 32px;
    width: 90%; max-width: 480px; position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  }
  .modal-x {
    position: absolute; top: 14px; right: 18px;
    background: none; border: none; font-size: 1.4rem;
    cursor: pointer; color: #6b7280; transition: color 0.15s;
  }
  .modal-x:hover { color: #0f172a; }
  .modal-box h2 {
    font-size: 1.1rem; font-weight: 600; color: #0f172a;
    margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;
  }
  .modal-row { display: flex; padding: 9px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; }
  .modal-row:last-child { border-bottom: none; }
  .modal-lbl { width: 40%; font-weight: 500; color: #6b7280; }
  .modal-val { color: #1f2937; }
  .modal-close-btn {
    margin-top: 20px; width: 100%; padding: 11px;
    background: #0f172a; color: #fff; border: none;
    border-radius: 8px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s;
  }
  .modal-close-btn:hover { background: #1d4ed8; }
`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      <style>{styles}</style>
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
                      <th>Customer</th><th>Amount</th><th>Status</th>
                      <th>Date</th><th>Details</th><th>Action</th>
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
                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{formatDate(order.createdAt)}</td>
                        <td>
                          <button className="btn-blue" onClick={() => setSelectedOrder(order)}>
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

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-x" onClick={() => setSelectedOrder(null)}>×</button>
            <h2>Shipping Details</h2>
            {[
              ["Customer", selectedOrder.customer?.fullName],
              ["Email", selectedOrder.customer?.email],
              ["Phone", selectedOrder.customer?.phone],
              ["Address", selectedOrder.customer?.address],
              ["City", selectedOrder.customer?.state],
              ["Country", selectedOrder.customer?.country],
              ["Postal Code", selectedOrder.customer?.postalCode],
              ["Order Date", formatDate(selectedOrder.createdAt)],
              ["Total", `₦${(selectedOrder.totalPrice || 0).toLocaleString()}`],
              ["Payment", selectedOrder.paymentStatus],
            ].map(([label, value]) => (
              <div className="modal-row" key={label}>
                <div className="modal-lbl">{label}</div>
                <div className="modal-val">{value || "N/A"}</div>
              </div>
            ))}
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
