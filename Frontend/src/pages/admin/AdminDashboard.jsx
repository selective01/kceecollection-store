import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // ✅ fixed
      if (!token) throw new Error("No token found. Please login again.");

      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || [];
      setOrders(data);

      // ✅ totalPrice not amount
      const total = data.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
      setRevenue(total);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <>
      <h1>Dashboard Overview</h1>
      <div className="admin-cards">
        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="admin-card">
          <h3>Total Revenue</h3>
          <p>₦{revenue.toLocaleString()}</p>
        </div>
      </div>
    </>
  );
}