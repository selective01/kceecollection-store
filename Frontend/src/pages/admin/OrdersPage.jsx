import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // ✅ fixed

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
      const token = localStorage.getItem("token"); // ✅ fixed
      if (!token) throw new Error("No token");

      await axios.put(`${BASE_URL}/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customer?.fullName || order.email || "N/A"}</td>
                <td>₦{(order.totalPrice || 0).toLocaleString()}</td> {/* ✅ totalPrice not amount */}
                <td>{order.status || "Pending"}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>
                  <select value={order.status || "Pending"}
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
    </>
  );
}