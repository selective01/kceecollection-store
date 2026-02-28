import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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
  .ap-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px; gap: 12px; flex-wrap: wrap;
  }
  .ap-toolbar-left { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #374151; }
  .ap-toolbar-right { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #374151; }
  .ap-select-sm {
    border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 5px 8px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #374151; background: #f9fafb; outline: none;
  }
  .ap-select-sm:focus { border-color: #1d4ed8; }
  .ap-search {
    border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 7px 12px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #374151; background: #f9fafb; outline: none; min-width: 200px;
  }
  .ap-search:focus { border-color: #1d4ed8; background: #fff; }
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
  .role-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
  .role-admin { background: #dbeafe; color: #1e40af; }
  .role-user { background: #f1f5f9; color: #475569; }
  .btn-red {
    background: #dc2626; color: #fff; border: none; padding: 6px 12px;
    border-radius: 6px; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s; margin-right: 6px;
  }
  .btn-red:hover { background: #b91c1c; }
  .btn-blue {
    background: #1d4ed8; color: #fff; border: none; padding: 6px 12px;
    border-radius: 6px; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s;
  }
  .btn-blue:hover { background: #1e40af; }
  .ap-empty { padding: 40px; text-align: center; color: #9ca3af; font-size: 0.9rem; }
`;

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
      <style>{styles}</style>
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
