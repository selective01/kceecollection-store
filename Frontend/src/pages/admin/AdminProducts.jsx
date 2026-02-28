import { useEffect, useState } from "react";
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

  /* Create form card */
  .ap-form-card {
    background: #fff; border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 24px; margin-bottom: 24px;
  }
  .ap-form-card h2 { font-size: 1rem; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
  .ap-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
  .ap-input {
    border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 9px 12px;
    font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
    color: #374151; background: #f9fafb; outline: none; width: 100%;
  }
  .ap-input:focus { border-color: #1d4ed8; background: #fff; }
  .btn-create {
    background: #1d4ed8; color: #fff; border: none; padding: 9px 20px;
    border-radius: 8px; font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s; margin-top: 12px;
  }
  .btn-create:hover { background: #1e40af; }

  /* Table */
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
  .btn-edit {
    background: #0f172a; color: #fff; border: none; padding: 6px 12px;
    border-radius: 6px; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s; margin-right: 6px;
  }
  .btn-edit:hover { background: #1d4ed8; }
  .btn-red {
    background: #dc2626; color: #fff; border: none; padding: 6px 12px;
    border-radius: 6px; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; font-weight: 500; transition: background 0.2s;
  }
  .btn-red:hover { background: #b91c1c; }
  .ap-empty { padding: 40px; text-align: center; color: #9ca3af; font-size: 0.9rem; }
  .prod-img { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; }

  /* Modal */
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.45); display: flex;
    align-items: center; justify-content: center; z-index: 1000;
  }
  .modal-box {
    background: #fff; border-radius: 12px; padding: 32px;
    width: 90%; max-width: 460px; position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  }
  .modal-x {
    position: absolute; top: 14px; right: 18px;
    background: none; border: none; font-size: 1.4rem;
    cursor: pointer; color: #6b7280;
  }
  .modal-x:hover { color: #0f172a; }
  .modal-box h2 { font-size: 1.1rem; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
  .modal-grid { display: flex; flex-direction: column; gap: 10px; }
  .modal-label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-save {
    flex: 1; padding: 11px; background: #1d4ed8; color: #fff;
    border: none; border-radius: 8px; font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif; cursor: pointer; font-weight: 500;
    transition: background 0.2s;
  }
  .btn-save:hover { background: #1e40af; }
  .btn-cancel {
    flex: 1; padding: 11px; background: #f1f5f9; color: #374151;
    border: none; border-radius: 8px; font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif; cursor: pointer; font-weight: 500;
  }
  .btn-cancel:hover { background: #e2e8f0; }
`;

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: 0, description: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => { if (user) fetchProducts(); }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch products");
    } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/products`, formData);
      setFormData({ name: "", price: 0, description: "", image: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create product");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete");
    } finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/products/${editProduct._id}`, editProduct);
      setIsEditModalOpen(false); setEditProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ap">
        <div className="ap-topbar">
          <h1>Manage Products</h1>
          <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Products</span></div>
        </div>

        <div className="ap-body">
          {error && <p style={{ color: "#dc2626", marginBottom: 12, fontSize: "0.85rem" }}>{error}</p>}

          {/* Create Form */}
          <div className="ap-form-card">
            <h2>Add New Product</h2>
            <form onSubmit={handleCreate}>
              <div className="ap-form-grid">
                <div>
                  <div className="modal-label">Product Name</div>
                  <input className="ap-input" type="text" placeholder="e.g. Premium Cap"
                    value={formData.name} required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <div className="modal-label">Price (₦)</div>
                  <input className="ap-input" type="number" placeholder="e.g. 5000"
                    value={formData.price} required
                    onChange={(e) => setFormData({ ...formData, price: +e.target.value })} />
                </div>
                <div>
                  <div className="modal-label">Description</div>
                  <input className="ap-input" type="text" placeholder="Short description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                  <div className="modal-label">Image URL</div>
                  <input className="ap-input" type="text" placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-create" disabled={loading}>
                {loading ? "Creating..." : "+ Create Product"}
              </button>
            </form>
          </div>

          {/* Products Table */}
          <div className="ap-card">
            {loading && products.length === 0 ? (
              <div className="ap-empty">Loading...</div>
            ) : products.length === 0 ? (
              <div className="ap-empty">No products found.</div>
            ) : (
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Image</th><th>Name</th><th>Price</th>
                    <th>Description</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.image
                          ? <img src={p.image} alt={p.name} className="prod-img" />
                          : <div style={{ width: 44, height: 44, background: "#f1f5f9", borderRadius: 6 }} />
                        }
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td>₦{p.price.toLocaleString()}</td>
                      <td style={{ color: "#6b7280", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.description || "—"}
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => { setEditProduct(p); setIsEditModalOpen(true); }}>Edit</button>
                        <button className="btn-red" onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-x" onClick={() => { setIsEditModalOpen(false); setEditProduct(null); }}>×</button>
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <div className="modal-grid">
                <div>
                  <div className="modal-label">Product Name</div>
                  <input className="ap-input" type="text" value={editProduct.name} required
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                </div>
                <div>
                  <div className="modal-label">Price (₦)</div>
                  <input className="ap-input" type="number" value={editProduct.price} required
                    onChange={(e) => setEditProduct({ ...editProduct, price: +e.target.value })} />
                </div>
                <div>
                  <div className="modal-label">Description</div>
                  <input className="ap-input" type="text" value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                </div>
                <div>
                  <div className="modal-label">Image URL</div>
                  <input className="ap-input" type="text" value={editProduct.image}
                    onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn-cancel"
                  onClick={() => { setIsEditModalOpen(false); setEditProduct(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
