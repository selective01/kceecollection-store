import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${BASE_URL}/api/orders`);
    setOrders(res.data);

    const totalRevenue = res.data.reduce(
      (acc, order) => acc + order.amount,
      0
    );

    setRevenue(totalRevenue);
  };

  return (
    <AdminLayout>
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
    </AdminLayout>
  );
}