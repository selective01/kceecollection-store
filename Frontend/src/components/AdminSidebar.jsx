import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h2>KCEE Admin</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/orders">Orders</Link>
      </nav>
    </div>
  );
}