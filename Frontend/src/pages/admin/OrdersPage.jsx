import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${BASE_URL}/api/orders`);
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${BASE_URL}/api/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <AdminLayout>
      <h1>Orders</h1>

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
              <td>{order.customer.fullName}</td>
              <td>₦{order.amount.toLocaleString()}</td>
              <td>{order.status}</td>
              <td>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                >
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}