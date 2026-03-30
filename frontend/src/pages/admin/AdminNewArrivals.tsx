import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const BASE_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  { label: "Bags",            href: "/bags" },
  { label: "Caps",            href: "/caps" },
  { label: "Club Jerseys",    href: "/club-jersey" },
  { label: "Designer Shirts", href: "/designer-shirts" },
  { label: "Hoodies",         href: "/hoodies" },
  { label: "Jeans",           href: "/jeans" },
  { label: "Jean Shorts",     href: "/jean-shorts" },
  { label: "Joggers",         href: "/joggers" },
  { label: "Perfume",         href: "/perfume" },
  { label: "Polo",            href: "/polo" },
  { label: "Retro Jerseys",   href: "/retro-jersey" },
  { label: "Shoes",           href: "/shoes" },
  { label: "Shorts",          href: "/shorts" },
  { label: "Sleeveless",      href: "/sleeveless" },
  { label: "Slippers",        href: "/slippers" },
  { label: "Sneakers",        href: "/sneakers" },
  { label: "T-Shirts",        href: "/t-shirts" },
  { label: "Watches",         href: "/watches" },
];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminNewArrivals() {
  const { user } = useAuth();
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({ title: "", price: "", href: "" });
  const [img1File, setImg1File] = useState(null);
  const [img1Preview, setImg1Preview] = useState(null);
  const [img2File, setImg2File] = useState(null);
  const [img2Preview, setImg2Preview] = useState(null);

  useEffect(() => { if (user) fetchArrivals(); }, [user]);

  const fetchArrivals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/newarrivals`);
      setArrivals(res.data);
    } catch {
      setError("Failed to fetch new arrivals");
    } finally { setLoading(false); }
  };

  const handleImageChange = (e, which) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (which === 1) { setImg1File(file); setImg1Preview(preview); }
    else { setImg2File(file); setImg2Preview(preview); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!img1File) { setError("Primary image is required"); return; }
    if (!formData.href) { setError("Please select a category"); return; }
    try {
      setLoading(true);
      const img1 = await toBase64(img1File);
      const img2 = img2File ? await toBase64(img2File) : "";
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/newarrivals`, { ...formData, img1, img2 }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("New arrival added successfully!");
      setFormData({ title: "", price: "", href: "" });
      setImg1File(null); setImg1Preview(null);
      setImg2File(null); setImg2Preview(null);
      fetchArrivals();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this new arrival?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/newarrivals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchArrivals();
    } catch {
      setError("Failed to delete");
    } finally { setLoading(false); }
  };

  return (
    <div className="ap">
      <div className="ap-topbar">
        <h1>New Arrivals</h1>
        <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>New Arrivals</span></div>
      </div>

      <div className="ap-body">
        {error && <p style={{ color: "#dc2626", marginBottom: 12, fontSize: "0.85rem" }}>{error}</p>}
        {success && <p style={{ color: "#16a34a", marginBottom: 12, fontSize: "0.85rem" }}>{success}</p>}

        <div className="ap-form-card">
          <h2>Add New Arrival</h2>
          <form onSubmit={handleCreate}>
            <div className="ap-form-grid">
              <div>
                <div className="field-label">Product Title *</div>
                <input className="ap-input" type="text" placeholder="e.g. Luxury Watch"
                  value={formData.title} required
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <div className="field-label">Price (₦) *</div>
                <input className="ap-input" type="number" placeholder="e.g. 45000"
                  value={formData.price} required
                  onChange={(e) => setFormData({ ...formData, price: +e.target.value })} />
              </div>
              <div>
                <div className="field-label">Category *</div>
                <select className="ap-input" value={formData.href} required
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.href} value={cat.href}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ap-form-grid" style={{ marginTop: 16 }}>
              <div>
                <div className="field-label">Primary Image *</div>
                <div className="file-upload-wrapper">
                  <input type="file" accept="image/*" className="file-upload-input"
                    id="img1-upload" onChange={(e) => handleImageChange(e, 1)} />
                  <label htmlFor="img1-upload" className="file-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {img1File ? img1File.name : "Choose Primary Image"}
                  </label>
                  {img1Preview && (
                    <div className="file-preview-wrap">
                      <img src={img1Preview} className="file-preview" alt="preview" />
                      <button type="button" className="file-remove"
                        onClick={() => { setImg1File(null); setImg1Preview(null); }}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="field-label">Secondary Image (hover effect)</div>
                <div className="file-upload-wrapper">
                  <input type="file" accept="image/*" className="file-upload-input"
                    id="img2-upload" onChange={(e) => handleImageChange(e, 2)} />
                  <label htmlFor="img2-upload" className="file-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {img2File ? img2File.name : "Choose Secondary Image"}
                  </label>
                  {img2Preview && (
                    <div className="file-preview-wrap">
                      <img src={img2Preview} className="file-preview" alt="preview" />
                      <button type="button" className="file-remove"
                        onClick={() => { setImg2File(null); setImg2Preview(null); }}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-add-product" disabled={loading}>
              {loading ? "Adding..." : "Add New Arrival"}
            </button>
          </form>
        </div>

        <div className="ap-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16, color: "#0f172a" }}>
            Current New Arrivals ({arrivals.length})
          </h2>
          {loading && arrivals.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Loading...</p>
          ) : arrivals.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No new arrivals yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {arrivals.map((item) => (
                <div key={item._id} style={{ border: "1px solid #f1f5f9", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#f8fafc" }}>
                    <img src={item.img1} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {item.img2 && (
                      <img src={item.img2} alt={item.title}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0, transition: "opacity 0.3s" }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0}
                      />
                    )}
                    <span style={{ position: "absolute", top: 8, left: 8, background: "#3A9D23", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>NEW</span>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#3A9D23", fontWeight: 600, marginBottom: 4 }}>{item.price}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: 10 }}>→ {item.href}</div>
                    <button className="btn-red" style={{ width: "100%" }} onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
