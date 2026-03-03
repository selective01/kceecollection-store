import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/adminProducts.css"

const BASE_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  "Bags", "Caps", "ClubJersey", "DesignerShirts", "Hoodies",
  "Jeans", "JeanShorts", "Joggers", "LongSleeve", "Perfume", "Polo",
  "RetroJersey", "Shoes", "Shorts", "Sleeveless", "Slippers",
  "Sneakers", "TShirts", "Watches"
];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: 0, cost: 0, description: "", category: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (isEdit) { setEditImageFile(file); setEditImagePreview(preview); }
    else { setImageFile(file); setImagePreview(preview); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.category) { setError("Please select a category"); return; }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let imageData = formData.image;
      if (imageFile) imageData = await toBase64(imageFile);
      await axios.post(`${BASE_URL}/api/products`, { ...formData, image: imageData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: "", price: 0, cost: 0, description: "", category: "", image: "" });
      setImageFile(null); setImagePreview(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create product");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete");
    } finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let imageData = editProduct.image;
      if (editImageFile) imageData = await toBase64(editImageFile);
      await axios.put(`${BASE_URL}/api/products/${editProduct._id}`, { ...editProduct, image: imageData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditModalOpen(false); setEditProduct(null);
      setEditImageFile(null); setEditImagePreview(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update");
    } finally { setLoading(false); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const paginated = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  const handleSearchChange = (e) => { setSearch(e.target.value); setCurrentPage(1); };
  const handleEntriesChange = (e) => { setEntriesPerPage(+e.target.value); setCurrentPage(1); };

  return (
    <>
      <div className="ap">
        <div className="ap-topbar">
          <h1>Manage Products</h1>
          <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Products</span></div>
        </div>

        <div className="ap-body">
          {error && <p style={{ color: "#dc2626", marginBottom: 12, fontSize: "0.85rem" }}>{error}</p>}

          <div className="ap-form-card">
            <h2>Add New Product</h2>
            <form onSubmit={handleCreate}>
              <div className="ap-form-grid">
                <div>
                  <div className="field-label">Product Name *</div>
                  <input className="ap-input" type="text" placeholder="e.g. Premium Cap"
                    value={formData.name} required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Category *</div>
                  <select className="ap-input" value={formData.category} required
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="field-label">Price (₦) *</div>
                  <input className="ap-input" type="number" placeholder="e.g. 5000"
                    value={formData.price} required
                    onChange={(e) => setFormData({ ...formData, price: +e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Cost Price (₦)</div>
                  <input className="ap-input" type="number" placeholder="e.g. 3000"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: +e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Description</div>
                  <input className="ap-input" type="text" placeholder="Short description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Product Image</div>
                  <div className="file-upload-wrapper">
                    <input type="file" accept="image/*" className="file-upload-input"
                      id="product-image-upload" onChange={(e) => handleImageChange(e, false)} />
                    <label htmlFor="product-image-upload" className="file-upload-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {imageFile ? imageFile.name : "Choose File"}
                    </label>
                    {imagePreview && (
                      <div className="file-preview-wrap">
                        <img src={imagePreview} className="file-preview" alt="preview" />
                        <span className="file-preview-name">{imageFile?.name}</span>
                        <button type="button" className="file-remove"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}>✕ Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-add-product" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          <div className="ap-toolbar">
            <div className="ap-entries">
              <span>Show</span>
              <select value={entriesPerPage} onChange={handleEntriesChange} className="ap-select">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
            <div className="ap-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" width="15" height="15">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="ap-search-input" type="text" placeholder="Search products..."
                value={search} onChange={handleSearchChange} />
            </div>
          </div>

          <div className="ap-card">
            {loading && products.length === 0 ? (
              <div className="ap-empty">Loading...</div>
            ) : paginated.length === 0 ? (
              <div className="ap-empty">{search ? `No products matching "${search}"` : "No products found."}</div>
            ) : (
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Description</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.image
                          ? <img src={p.image} alt={p.name} className="prod-img" />
                          : <div style={{ width: 44, height: 44, background: "#f1f5f9", borderRadius: 6 }} />
                        }
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td><span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: "0.78rem" }}>{p.category || "—"}</span></td>
                      <td>₦{p.price.toLocaleString()}</td>
                      <td style={{ color: "#6b7280", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description || "—"}</td>
                      <td>
                        <button className="btn-edit" onClick={() => { setEditProduct(p); setEditImagePreview(p.image || null); setIsEditModalOpen(true); }}>Edit</button>
                        <button className="btn-red" onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {filtered.length > entriesPerPage && (
            <div className="ap-pagination">
              <span className="ap-page-info">
                Showing {((currentPage - 1) * entriesPerPage) + 1}–{Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} products
              </span>
              <div className="ap-page-btns">
                <button className="ap-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? <span key={i} className="ap-page-ellipsis">…</span> :
                    <button key={p} className={`ap-page-btn ${currentPage === p ? "active" : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>
                  )}
                <button className="ap-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && editProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-x" onClick={() => { setIsEditModalOpen(false); setEditProduct(null); setEditImageFile(null); setEditImagePreview(null); }}>×</button>
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <div className="modal-grid">
                <div>
                  <div className="field-label">Product Name</div>
                  <input className="ap-input" type="text" value={editProduct.name} required
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Category</div>
                  <select className="ap-input" value={editProduct.category || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="field-label">Price (₦)</div>
                  <input className="ap-input" type="number" value={editProduct.price} required
                    onChange={(e) => setEditProduct({ ...editProduct, price: +e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Description</div>
                  <input className="ap-input" type="text" value={editProduct.description || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Product Image</div>
                  {editImagePreview && (
                    <div className="file-preview-wrap" style={{ marginBottom: 8 }}>
                      <img src={editImagePreview} className="file-preview" alt="current" />
                      <span className="file-preview-name" style={{ color: "#6b7280" }}>Current image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="file-upload-input"
                    id="edit-image-upload" onChange={(e) => handleImageChange(e, true)} />
                  <label htmlFor="edit-image-upload" className="file-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {editImageFile ? editImageFile.name : "Change Image"}
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                <button type="button" className="btn-cancel"
                  onClick={() => { setIsEditModalOpen(false); setEditProduct(null); setEditImageFile(null); setEditImagePreview(null); }}>
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
