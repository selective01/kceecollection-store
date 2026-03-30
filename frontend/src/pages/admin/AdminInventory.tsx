// AdminInventory.tsx — Phase 3
// Full inventory management: view all products with stock levels,
// bulk stock update, low-stock alerts, inline edit stock per product
import { useEffect, useState, useMemo } from "react";
import { get, put } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import "../../assets/css/adminInventory.css";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  image?: string;
  productId?: string;
}

const LOW_STOCK = 5;
const OUT_OF_STOCK = 0;

const stockStatus = (n: number) => {
  if (n <= OUT_OF_STOCK) return { label: "Out of stock", cls: "inv-badge-out" };
  if (n <= LOW_STOCK)    return { label: "Low stock",    cls: "inv-badge-low" };
  return                        { label: "In stock",     cls: "inv-badge-ok"  };
};

export default function AdminInventory() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStk, setFilterStk] = useState("All");
  const [editing, setEditing]     = useState<Record<string, string>>({}); // id → draft value
  const [saving, setSaving]       = useState<Record<string, boolean>>({});
  const [toast, setToast]         = useState("");

  // Bulk selection
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [bulkVal, setBulkVal]     = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);

  useEffect(() => {
    get<Product[]>("/api/products")
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.productId?.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "All" || p.category === filterCat;
      const matchStk =
        filterStk === "All" ||
        (filterStk === "Out" && p.stock <= 0) ||
        (filterStk === "Low" && p.stock > 0 && p.stock <= LOW_STOCK) ||
        (filterStk === "Ok"  && p.stock > LOW_STOCK);
      return matchSearch && matchCat && matchStk;
    });
  }, [products, search, filterCat, filterStk]);

  const stats = useMemo(() => ({
    total:    products.length,
    outStock: products.filter((p) => p.stock <= 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length,
    healthy:  products.filter((p) => p.stock > LOW_STOCK).length,
  }), [products]);

  const saveStock = async (id: string) => {
    const val = parseInt(editing[id] ?? "");
    if (isNaN(val) || val < 0) return;
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      await put(`/products/${id}`, { stock: val });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: val } : p))
      );
      setEditing((e) => { const n = { ...e }; delete n[id]; return n; });
      showToast("Stock updated");
    } catch {
      showToast("Failed to update stock");
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p._id)));
    }
  };

  const applyBulkStock = async () => {
    const val = parseInt(bulkVal);
    if (isNaN(val) || val < 0 || selected.size === 0) return;
    setBulkSaving(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) => put(`/products/${id}`, { stock: val }))
      );
      setProducts((prev) =>
        prev.map((p) => (selected.has(p._id) ? { ...p, stock: val } : p))
      );
      setSelected(new Set());
      setBulkVal("");
      showToast(`Updated ${selected.size} products`);
    } catch {
      showToast("Bulk update failed");
    } finally {
      setBulkSaving(false);
    }
  };

  return (
    <div className="inv-wrap">
      {/* Toast */}
      {toast && <div className="inv-toast">{toast}</div>}

      {/* Top bar */}
      <div className="inv-topbar">
        <div>
          <h1>Inventory</h1>
          <p className="inv-breadcrumb">Admin / <span>Inventory</span></p>
        </div>
      </div>

      <div className="inv-body">
        {/* Stat cards */}
        <div className="inv-stats">
          <div className="inv-stat inv-stat-blue">
            <div className="inv-stat-icon"><i className="fas fa-boxes" /></div>
            <div>
              <p className="inv-stat-val">{stats.total}</p>
              <p className="inv-stat-lbl">Total Products</p>
            </div>
          </div>
          <div className="inv-stat inv-stat-green">
            <div className="inv-stat-icon"><i className="fas fa-check-circle" /></div>
            <div>
              <p className="inv-stat-val">{stats.healthy}</p>
              <p className="inv-stat-lbl">In Stock</p>
            </div>
          </div>
          <div className="inv-stat inv-stat-orange">
            <div className="inv-stat-icon"><i className="fas fa-exclamation-triangle" /></div>
            <div>
              <p className="inv-stat-val">{stats.lowStock}</p>
              <p className="inv-stat-lbl">Low Stock</p>
            </div>
          </div>
          <div className="inv-stat inv-stat-red">
            <div className="inv-stat-icon"><i className="fas fa-times-circle" /></div>
            <div>
              <p className="inv-stat-val">{stats.outStock}</p>
              <p className="inv-stat-lbl">Out of Stock</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="inv-toolbar">
          <div className="inv-search-wrap">
            <i className="fas fa-search" />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="inv-search"
            />
          </div>

          <div className="inv-filter-group">
            <select
              className="inv-select"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select
              className="inv-select"
              value={filterStk}
              onChange={(e) => setFilterStk(e.target.value)}
            >
              <option value="All">All stock levels</option>
              <option value="Ok">In stock</option>
              <option value="Low">Low stock</option>
              <option value="Out">Out of stock</option>
            </select>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="inv-bulk-bar">
            <span className="inv-bulk-info">
              <i className="fas fa-check-square" />
              {selected.size} product{selected.size > 1 ? "s" : ""} selected
            </span>
            <div className="inv-bulk-actions">
              <input
                type="number"
                min="0"
                placeholder="New stock qty"
                value={bulkVal}
                onChange={(e) => setBulkVal(e.target.value)}
                className="inv-bulk-input"
              />
              <button
                className="inv-bulk-btn"
                onClick={applyBulkStock}
                disabled={bulkSaving || !bulkVal}
              >
                {bulkSaving ? "Updating..." : "Apply to selected"}
              </button>
              <button
                className="inv-bulk-clear"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="inv-card">
          {loading ? (
            <div className="inv-loading">
              <div className="inv-spinner" />
              Loading inventory...
            </div>
          ) : filtered.length === 0 ? (
            <div className="inv-empty">
              <i className="fas fa-box-open" />
              <p>No products match your filters</p>
            </div>
          ) : (
            <table className="inv-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="inv-checkbox"
                    />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Stock</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const status = stockStatus(p.stock);
                  const isEditing = p._id in editing;
                  return (
                    <tr key={p._id} className={selected.has(p._id) ? "inv-row-selected" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(p._id)}
                          onChange={() => toggleSelect(p._id)}
                          className="inv-checkbox"
                        />
                      </td>
                      <td>
                        <div className="inv-product-cell">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="inv-prod-img" />
                          ) : (
                            <div className="inv-prod-img-ph">
                              <i className="fas fa-image" />
                            </div>
                          )}
                          <div>
                            <p className="inv-prod-name">{p.name}</p>
                            {p.productId && (
                              <p className="inv-prod-id">#{p.productId}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td><span className="inv-cat-tag">{p.category || "—"}</span></td>
                      <td className="inv-price">{formatCurrency(p.price)}</td>
                      <td>
                        <span className={`inv-badge ${status.cls}`}>{status.label}</span>
                      </td>
                      <td>
                        <span className={`inv-stock-num ${p.stock <= 0 ? "inv-stock-zero" : p.stock <= LOW_STOCK ? "inv-stock-low" : ""}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <div className="inv-edit-cell">
                          <input
                            type="number"
                            min="0"
                            className="inv-stock-input"
                            placeholder={String(p.stock)}
                            value={isEditing ? editing[p._id] : ""}
                            onChange={(e) =>
                              setEditing((prev) => ({ ...prev, [p._id]: e.target.value }))
                            }
                          />
                          {isEditing && (
                            <button
                              className="inv-save-btn"
                              onClick={() => saveStock(p._id)}
                              disabled={saving[p._id]}
                            >
                              {saving[p._id] ? <i className="fas fa-spinner fa-spin" /> : "Save"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="inv-footer-note">
          Showing {filtered.length} of {products.length} products.
          Low stock threshold: <strong>{LOW_STOCK} units</strong>.
        </p>
      </div>
    </div>
  );
}
