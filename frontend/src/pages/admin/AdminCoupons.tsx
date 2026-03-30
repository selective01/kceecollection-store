// AdminCoupons.tsx — Phase 3
// Full coupon management: create, list, toggle active/inactive, delete
// Requires: POST /api/coupons, GET /api/coupons, PUT /api/coupons/:id, DELETE /api/coupons/:id
import { useEffect, useState } from "react";
import { get, post, put, del } from "@/utils/api";
import { formatDate } from "@/utils/format";
import "../../assets/css/adminCoupons.css";

interface Coupon {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
}

const emptyForm = {
  code: "",
  type: "percent" as "percent" | "fixed",
  value: "",
  minOrder: "",
  maxUses: "",
  expiresAt: "",
};

export default function AdminCoupons() {
  const [coupons, setCoupons]   = useState<Coupon[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(emptyForm);
  const [formErr, setFormErr]   = useState("");
  const [formSaving, setFormSaving] = useState(false);
  const [toast, setToast]       = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setLoading(true);
    get<Coupon[]>("/api/coupons")
      .then(setCoupons)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleCreate = async () => {
    if (!form.code.trim()) { setFormErr("Code is required."); return; }
    if (!form.value || isNaN(Number(form.value))) { setFormErr("Value is required."); return; }
    if (form.type === "percent" && Number(form.value) > 100) { setFormErr("Percent discount can't exceed 100%."); return; }
    setFormErr("");
    setFormSaving(true);
    try {
      const payload = {
        code:      form.code.trim().toUpperCase(),
        type:      form.type,
        value:     Number(form.value),
        minOrder:  form.minOrder ? Number(form.minOrder) : undefined,
        maxUses:   form.maxUses  ? Number(form.maxUses)  : undefined,
        expiresAt: form.expiresAt || undefined,
      };
      const created = await post<Coupon>("/api/coupons", payload);
      setCoupons((prev) => [created, ...prev]);
      setForm(emptyForm);
      showToast(`Coupon "${created.code}" created`);
    } catch (e: unknown) {
      setFormErr(e instanceof Error ? e.message : "Failed to create coupon");
    } finally {
      setFormSaving(false);
    }
  };

  const toggleActive = async (c: Coupon) => {
    try {
      const updated = await put<Coupon>(`/coupons/${c._id}`, { active: !c.active });
      setCoupons((prev) => prev.map((x) => (x._id === c._id ? updated : x)));
      showToast(`Coupon ${updated.active ? "activated" : "deactivated"}`);
    } catch {
      showToast("Failed to update coupon");
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm("Delete this coupon? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await del(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      showToast("Coupon deleted");
    } catch {
      showToast("Failed to delete coupon");
    } finally {
      setDeleting(null);
    }
  };

  const isExpired = (c: Coupon) =>
    c.expiresAt ? new Date(c.expiresAt) < new Date() : false;

  return (
    <div className="cou-wrap">
      {toast && <div className="cou-toast">{toast}</div>}

      {/* Top bar */}
      <div className="cou-topbar">
        <div>
          <h1>Coupons</h1>
          <p className="cou-breadcrumb">Admin / <span>Coupons</span></p>
        </div>
      </div>

      <div className="cou-body">
        {/* Stats row */}
        <div className="cou-stats">
          <div className="cou-stat">
            <i className="fas fa-ticket-alt" />
            <div>
              <p className="cou-stat-val">{coupons.length}</p>
              <p className="cou-stat-lbl">Total Coupons</p>
            </div>
          </div>
          <div className="cou-stat">
            <i className="fas fa-check-circle cou-green" />
            <div>
              <p className="cou-stat-val">{coupons.filter((c) => c.active && !isExpired(c)).length}</p>
              <p className="cou-stat-lbl">Active</p>
            </div>
          </div>
          <div className="cou-stat">
            <i className="fas fa-mouse-pointer cou-blue" />
            <div>
              <p className="cou-stat-val">{coupons.reduce((s, c) => s + (c.usedCount || 0), 0)}</p>
              <p className="cou-stat-lbl">Total Uses</p>
            </div>
          </div>
          <div className="cou-stat">
            <i className="fas fa-calendar-times cou-red" />
            <div>
              <p className="cou-stat-val">{coupons.filter(isExpired).length}</p>
              <p className="cou-stat-lbl">Expired</p>
            </div>
          </div>
        </div>

        {/* Create form */}
        <div className="cou-form-card">
          <h2 className="cou-form-title">
            <i className="fas fa-plus-circle" /> Create Coupon
          </h2>

          {formErr && (
            <div className="cou-form-err">
              <i className="fas fa-exclamation-circle" /> {formErr}
            </div>
          )}

          <div className="cou-form-grid">
            <div className="cou-field">
              <label className="cou-label">Coupon Code *</label>
              <input
                className="cou-input cou-input-upper"
                placeholder="e.g. SAVE20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="cou-field">
              <label className="cou-label">Discount Type *</label>
              <select
                className="cou-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>

            <div className="cou-field">
              <label className="cou-label">
                {form.type === "percent" ? "Discount %" : "Discount Amount (₦)"} *
              </label>
              <input
                className="cou-input"
                type="number"
                min="0"
                max={form.type === "percent" ? "100" : undefined}
                placeholder={form.type === "percent" ? "e.g. 20" : "e.g. 5000"}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>

            <div className="cou-field">
              <label className="cou-label">Min. Order Amount (₦)</label>
              <input
                className="cou-input"
                type="number"
                min="0"
                placeholder="Optional"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
              />
            </div>

            <div className="cou-field">
              <label className="cou-label">Max Uses</label>
              <input
                className="cou-input"
                type="number"
                min="1"
                placeholder="Unlimited"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              />
            </div>

            <div className="cou-field">
              <label className="cou-label">Expiry Date</label>
              <input
                className="cou-input"
                type="date"
                value={form.expiresAt}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <div className="cou-form-foot">
            <button className="cou-create-btn" onClick={handleCreate} disabled={formSaving}>
              {formSaving ? (
                <><i className="fas fa-spinner fa-spin" /> Creating...</>
              ) : (
                <><i className="fas fa-plus" /> Create Coupon</>
              )}
            </button>
            <button className="cou-reset-btn" onClick={() => { setForm(emptyForm); setFormErr(""); }}>
              Reset
            </button>
          </div>
        </div>

        {/* Coupons table */}
        <div className="cou-card">
          <div className="cou-card-head">
            <h2>All Coupons</h2>
            <span className="cou-count">{coupons.length} total</span>
          </div>

          {loading ? (
            <div className="cou-loading">
              <div className="cou-spinner" /> Loading...
            </div>
          ) : coupons.length === 0 ? (
            <div className="cou-empty">
              <i className="fas fa-ticket-alt" />
              <p>No coupons yet. Create one above.</p>
            </div>
          ) : (
            <div className="cou-table-wrap">
              <table className="cou-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Min Order</th>
                    <th>Uses</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                    const expired = isExpired(c);
                    return (
                      <tr key={c._id}>
                        <td>
                          <span className="cou-code-chip">{c.code}</span>
                        </td>
                        <td>
                          <span className={`cou-type-badge ${c.type === "percent" ? "cou-type-pct" : "cou-type-fixed"}`}>
                            {c.type === "percent" ? "%" : "₦"} {c.type}
                          </span>
                        </td>
                        <td className="cou-value">
                          {c.type === "percent" ? `${c.value}%` : `₦${c.value.toLocaleString()}`}
                        </td>
                        <td>{c.minOrder ? `₦${c.minOrder.toLocaleString()}` : "—"}</td>
                        <td>
                          <span className="cou-uses">
                            {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                          </span>
                        </td>
                        <td>
                          {c.expiresAt ? (
                            <span className={expired ? "cou-expired-text" : ""}>
                              {formatDate(c.expiresAt)}
                              {expired && " (expired)"}
                            </span>
                          ) : "No expiry"}
                        </td>
                        <td>
                          <button
                            className={`cou-toggle-btn ${c.active && !expired ? "cou-toggle-on" : "cou-toggle-off"}`}
                            onClick={() => toggleActive(c)}
                            disabled={expired}
                          >
                            {c.active && !expired ? "Active" : expired ? "Expired" : "Inactive"}
                          </button>
                        </td>
                        <td>
                          <button
                            className="cou-del-btn"
                            onClick={() => deleteCoupon(c._id)}
                            disabled={deleting === c._id}
                          >
                            {deleting === c._id
                              ? <i className="fas fa-spinner fa-spin" />
                              : <i className="fas fa-trash" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
