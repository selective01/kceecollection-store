import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/adminProducts.css"

const BASE_URL = import.meta.env.VITE_API_URL;

// Convert file to base64
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
  const [formData, setFormData] = useState({ name: "", price: 0, description: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

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
    if (isEdit) {
      setEditImageFile(file);
      setEditImagePreview(preview);
    } else {
      setImageFile(file);
      setImagePreview(preview);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageData = formData.image;
      if (imageFile) imageData = await toBase64(imageFile);
      await axios.post(`${BASE_URL}/api/products`, { ...formData, image: imageData });
      setFormData({ name: "", price: 0, description: "", image: "" });
      setImageFile(null);
      setImagePreview(null);
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
      let imageData = editProduct.image;
      if (editImageFile) imageData = await toBase64(editImageFile);
      await axios.put(`${BASE_URL}/api/products/${editProduct._id}`, { ...editProduct, image: imageData });
      setIsEditModalOpen(false); setEditProduct(null);
      setEditImageFile(null); setEditImagePreview(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update");
    } finally { setLoading(false); }
  };

  return (
    <>
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
                  <div className="field-label">Product Name *</div>
                  <input className="ap-input" type="text" placeholder="e.g. Premium Cap"
                    value={formData.name} required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Price (₦) *</div>
                  <input className="ap-input" type="number" placeholder="e.g. 5000"
                    value={formData.price} required
                    onChange={(e) => setFormData({ ...formData, price: +e.target.value })} />
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
                    <input
                      type="file" accept="image/*"
                      className="file-upload-input"
                      id="product-image-upload"
                      onChange={(e) => handleImageChange(e, false)}
                    />
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
                          onClick={() => { setImageFile(null); setImagePreview(null); }}>
                          ✕ Remove
                        </button>
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
                        <button className="btn-edit" onClick={() => {
                          setEditProduct(p);
                          setEditImagePreview(p.image || null);
                          setIsEditModalOpen(true);
                        }}>Edit</button>
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
            <button className="modal-x" onClick={() => {
              setIsEditModalOpen(false); setEditProduct(null);
              setEditImageFile(null); setEditImagePreview(null);
            }}>×</button>
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <div className="modal-grid">
                <div>
                  <div className="field-label">Product Name</div>
                  <input className="ap-input" type="text" value={editProduct.name} required
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
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
                  <input
                    type="file" accept="image/*"
                    className="file-upload-input"
                    id="edit-image-upload"
                    onChange={(e) => handleImageChange(e, true)}
                  />
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
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
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
