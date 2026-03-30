import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import "../../assets/css/adminCategories.css"

const BASE_URL = import.meta.env.VITE_API_URL;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: "", href: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (user) fetchCategories(); }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) { setError("Please select an image"); return; }
    try {
      setLoading(true); setError("");
      const token = localStorage.getItem("token");
      const imageData = await toBase64(imageFile);

      // Auto-generate href from title if not provided
      const href = formData.href || `/${formData.title.toLowerCase().replace(/\s+/g, "-")}`;

      await axios.post(`${BASE_URL}/api/categories`,
        { ...formData, href, image: imageData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({ title: "", href: "" });
      setImageFile(null); setImagePreview(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create category");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch {
      setError("Failed to delete category");
    }
  };

  return (
    <>
      <div className="ap">
        <div className="ap-topbar">
          <h1>Manage Categories</h1>
          <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Categories</span></div>
        </div>

        <div className="ap-body">
          {error && <p style={{ color: "#dc2626", marginBottom: 12, fontSize: "0.85rem" }}>{error}</p>}

          {/* Create Form */}
          <div className="ap-form-card">
            <h2>Add New Category</h2>
            <form onSubmit={handleCreate}>
              <div className="ap-form-grid">
                <div>
                  <div className="field-label">Category Name *</div>
                  <input className="ap-input" type="text" placeholder="e.g. Hoodies"
                    value={formData.title} required
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">URL Path (optional)</div>
                  <input className="ap-input" type="text" placeholder="e.g. /hoodies (auto-generated if empty)"
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })} />
                </div>
                <div>
                  <div className="field-label">Category Image *</div>
                  <input type="file" accept="image/*"
                    className="file-upload-input" id="cat-image-upload"
                    onChange={handleImageChange} />
                  <label htmlFor="cat-image-upload" className="file-upload-label">
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
                      <button type="button" className="file-remove"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}>
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-add" disabled={loading}>
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="section-title">All Categories ({categories.length})</div>
          {loading && categories.length === 0 ? (
            <div className="ap-empty">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="ap-empty">No categories yet. Add one above.</div>
          ) : (
            <div className="cat-grid">
              {categories.map((cat) => (
                <div key={cat._id} className="cat-card">
                  <button className="cat-card-delete" onClick={() => handleDelete(cat._id)}>
                    ✕ Delete
                  </button>
                  {cat.image
                    ? <img src={cat.image} alt={cat.title} className="cat-card-img" />
                    : <div className="cat-card-img-ph">No image</div>
                  }
                  <div className="cat-card-info">
                    <div className="cat-card-title">{cat.title}</div>
                    <div className="cat-card-href">{cat.href}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
