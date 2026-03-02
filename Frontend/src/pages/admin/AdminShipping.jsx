import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function AdminShipping() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    state: "", baseRate: "", perKgRate: 500,
    provider: "Standard Delivery", deliveryDays: "3-5 business days"
  });

  useEffect(() => { fetchRates(); }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/shipping/rates`);
      setRates(res.data);
    } catch {
      setError("Failed to fetch rates");
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/shipping/rates`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Shipping rate for ${formData.state} saved!`);
      setFormData({ state: "", baseRate: "", perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" });
      fetchRates();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save rate");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this shipping rate?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/shipping/rates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRates();
    } catch {
      setError("Failed to delete");
    }
  };

  const unconfiguredStates = NIGERIAN_STATES.filter(
    (s) => !rates.find((r) => r.state.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="ap">
      <div className="ap-topbar">
        <h1>Shipping Rates</h1>
        <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Shipping</span></div>
      </div>

      <div className="ap-body">
        {error && <p style={{ color: "#dc2626", marginBottom: 12, fontSize: "0.85rem" }}>{error}</p>}
        {success && <p style={{ color: "#16a34a", marginBottom: 12, fontSize: "0.85rem" }}>{success}</p>}

        {/* API Status Banner */}
        <div style={{
          background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8,
          padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <i className="fa-solid fa-circle-info" style={{ color: "#ea580c", marginTop: 2 }}></i>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 600, color: "#9a3412" }}>
              Logistics API Integration Pending
            </p>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#c2410c" }}>
              DHL and GIG Logistics APIs are configured but require API keys. Add <code>DHL_API_KEY</code>, <code>DHL_API_SECRET</code>, and <code>GIG_API_KEY</code> to Render environment variables when ready. Rates below are used as fallback until then.
            </p>
          </div>
        </div>

        {/* Add Rate Form */}
        <div className="ap-form-card">
          <h2>Add / Update Shipping Rate</h2>
          <form onSubmit={handleSubmit}>
            <div className="ap-form-grid">
              <div>
                <div className="field-label">State *</div>
                <select className="ap-input" value={formData.state} required
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}>
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="field-label">Base Rate (₦) *</div>
                <input className="ap-input" type="number" placeholder="e.g. 2000"
                  value={formData.baseRate} required
                  onChange={(e) => setFormData({ ...formData, baseRate: +e.target.value })} />
              </div>
              <div>
                <div className="field-label">Per Extra KG (₦)</div>
                <input className="ap-input" type="number" placeholder="e.g. 500"
                  value={formData.perKgRate}
                  onChange={(e) => setFormData({ ...formData, perKgRate: +e.target.value })} />
              </div>
              <div>
                <div className="field-label">Provider</div>
                <input className="ap-input" type="text" placeholder="e.g. GIG Logistics"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })} />
              </div>
              <div>
                <div className="field-label">Delivery Days</div>
                <input className="ap-input" type="text" placeholder="e.g. 2-4 business days"
                  value={formData.deliveryDays}
                  onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-add-product" disabled={loading}>
              {loading ? "Saving..." : "Save Rate"}
            </button>
          </form>
        </div>

        {/* Unconfigured States Warning */}
        {unconfiguredStates.length > 0 && (
          <div style={{
            background: "#fefce8", border: "1px solid #fde047", borderRadius: 8,
            padding: "12px 16px", marginBottom: 20,
          }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.85rem", fontWeight: 600, color: "#854d0e" }}>
              {unconfiguredStates.length} states without custom rates (using ₦3,500 default)
            </p>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#a16207" }}>
              {unconfiguredStates.join(", ")}
            </p>
          </div>
        )}

        {/* Rates Table */}
        <div className="ap-card">
          {loading && rates.length === 0 ? (
            <div className="ap-empty">Loading...</div>
          ) : rates.length === 0 ? (
            <div className="ap-empty">No shipping rates configured yet. Add rates above.</div>
          ) : (
            <table className="ap-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Base Rate</th>
                  <th>Per Extra KG</th>
                  <th>Provider</th>
                  <th>Delivery Days</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r._id}>
                    <td><strong>{r.state}</strong></td>
                    <td>₦{r.baseRate.toLocaleString()}</td>
                    <td>₦{(r.perKgRate || 500).toLocaleString()}</td>
                    <td>{r.provider || "Standard Delivery"}</td>
                    <td style={{ color: "#6b7280" }}>{r.deliveryDays || "3-5 business days"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => setFormData({
                        state: r.state, baseRate: r.baseRate,
                        perKgRate: r.perKgRate || 500,
                        provider: r.provider || "Standard Delivery",
                        deliveryDays: r.deliveryDays || "3-5 business days",
                      })}>Edit</button>
                      <button className="btn-red" onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
