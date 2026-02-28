import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/adminUsers.css"

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => { if (user) fetchUsers(); }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true); setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch users");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete user");
    } finally { setLoading(false); }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="ap">
        <div className="ap-topbar">
          <h1>Manage Users</h1>
          <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Users</span></div>
        </div>

        <div className="ap-body">
          {error && <p style={{ color: "#dc2626", marginBottom: 12 }}>{error}</p>}

          <div className="ap-toolbar">
            <div className="ap-toolbar-left">
              Show
              <select className="ap-select-sm" value={entries}
                onChange={(e) => setEntries(Number(e.target.value))}>
                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              entries
            </div>
            <div className="ap-toolbar-right">
              Search:
              <input className="ap-search" type="text" value={search}
                onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." />
            </div>
          </div>

          <div className="ap-card">
            {loading ? (
              <div className="ap-empty">Loading...</div>
            ) : filteredUsers.slice(0, entries).length === 0 ? (
              <div className="ap-empty">No users found.</div>
            ) : (
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>S/N</th><th>Name</th><th>Email</th>
                    <th>Role</th><th>Date Joined</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, entries).map((u, index) => (
                    <tr key={u._id}>
                      <td style={{ color: "#9ca3af" }}>{index + 1}</td>
                      <td><strong>{u.name}</strong></td>
                      <td style={{ color: "#6b7280" }}>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>{u.role}</span>
                      </td>
                      <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td>
                        <button className="btn-red" onClick={() => handleDelete(u._id)}>Delete</button>
                        <button className="btn-blue" onClick={() => navigate(`/admin/shipping/${u._id}`)}>
                          Shipping
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
