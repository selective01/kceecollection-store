import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Config (admin can tweak these) ───────────────────────────────────────────
const PAYSTACK_FEE_PERCENT = 1.5; // 1.5% of revenue
const PACKAGING_COST_PER_ORDER = 500; // ₦500 per order

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + "%" : "0%");

const filterByPeriod = (orders, period) => {
  const now = new Date();
  return orders.filter((o) => {
    const d = new Date(o.createdAt);
    if (period === "daily") return d.toDateString() === now.toDateString();
    if (period === "weekly") return now - d <= 7 * 86400000;
    if (period === "monthly") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true; // all time
  });
};

const getLast12Months = (orders) => {
  const map = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
    map[key] = { revenue: 0, profit: 0, orders: 0 };
  }
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
    if (map[key]) {
      map[key].revenue += o.totalPrice || 0;
      map[key].orders += 1;
      const fees = (o.totalPrice || 0) * (PAYSTACK_FEE_PERCENT / 100);
      const packaging = PACKAGING_COST_PER_ORDER;
      const shipping = o.shippingCost || 0;
      const cogs = (o.items || []).reduce((s, item) => s + (item.cost || 0) * (item.quantity || 1), 0);
      map[key].profit += (o.totalPrice || 0) - fees - packaging - shipping - cogs;
    }
  });
  return Object.entries(map).map(([month, v]) => ({ month, ...v }));
};

const getTopProducts = (orders) => {
  const map = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const key = item.name || "Unknown";
      if (!map[key]) map[key] = { name: key, qty: 0, revenue: 0, cost: 0 };
      map[key].qty += item.quantity || 1;
      map[key].revenue += (item.price || 0) * (item.quantity || 1);
      map[key].cost += (item.cost || 0) * (item.quantity || 1);
    });
  });
  return Object.values(map)
    .map((p) => ({ ...p, profit: p.revenue - p.cost }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = "#3A9D23" }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 80, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              width: "100%", background: "#3A9D23",
              height: `${(d.revenue / maxRev) * 120}px`,
              borderRadius: "4px 4px 0 0", minHeight: 2,
              transition: "height 0.5s ease",
            }} title={`Revenue: ${fmt(d.revenue)}`} />
            <div style={{
              width: "100%", background: d.profit >= 0 ? "#86efac" : "#fca5a5",
              height: `${Math.abs(d.profit / maxRev) * 120}px`,
              borderRadius: "0 0 4px 4px", minHeight: 2,
            }} title={`Profit: ${fmt(d.profit)}`} />
          </div>
          <span style={{ fontSize: 9, color: "#9ca3af", whiteSpace: "nowrap" }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Export helpers ────────────────────────────────────────────────────────────
const exportCSV = (orders, period) => {
  const rows = [["Reference", "Date", "Customer", "Items", "Revenue", "Shipping", "Payment Fee", "Packaging", "COGS", "Net Profit", "Payment Status", "Delivery Status"]];
  filterByPeriod(orders, period).forEach((o) => {
    const rev = o.totalPrice || 0;
    const shipping = o.shippingCost || 0;
    const fees = rev * (PAYSTACK_FEE_PERCENT / 100);
    const packaging = PACKAGING_COST_PER_ORDER;
    const cogs = (o.items || []).reduce((s, i) => s + (i.cost || 0) * (i.quantity || 1), 0);
    const profit = rev - shipping - fees - packaging - cogs;
    rows.push([
      o.reference || o._id,
      new Date(o.createdAt).toLocaleDateString("en-GB"),
      o.customer?.fullName || "—",
      (o.items || []).map((i) => `${i.name}(x${i.quantity})`).join("; "),
      rev, shipping, fees.toFixed(2), packaging, cogs, profit.toFixed(2),
      o.paymentStatus || "—", o.status || "—",
    ]);
  });
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = `sales-report-${period}.csv`; a.click();
};

const exportExcel = async (orders, period) => {
  // Build a simple HTML table that Excel can open
  const filtered = filterByPeriod(orders, period);
  let html = `<table><tr><th>Reference</th><th>Date</th><th>Customer</th><th>Revenue</th><th>Shipping</th><th>Paystack Fee</th><th>Packaging</th><th>COGS</th><th>Net Profit</th><th>Payment</th><th>Status</th></tr>`;
  filtered.forEach((o) => {
    const rev = o.totalPrice || 0;
    const shipping = o.shippingCost || 0;
    const fees = (rev * (PAYSTACK_FEE_PERCENT / 100)).toFixed(2);
    const cogs = (o.items || []).reduce((s, i) => s + (i.cost || 0) * (i.quantity || 1), 0);
    const profit = (rev - shipping - Number(fees) - PACKAGING_COST_PER_ORDER - cogs).toFixed(2);
    html += `<tr><td>${o.reference || o._id}</td><td>${new Date(o.createdAt).toLocaleDateString("en-GB")}</td><td>${o.customer?.fullName || "—"}</td><td>${rev}</td><td>${shipping}</td><td>${fees}</td><td>${PACKAGING_COST_PER_ORDER}</td><td>${cogs}</td><td>${profit}</td><td>${o.paymentStatus || "—"}</td><td>${o.status || "—"}</td></tr>`;
  });
  html += `</table>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = `sales-report-${period}.xls`; a.click();
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminSalesReport() {
  const [allOrders, setAllOrders] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [paystackFee, setPaystackFee] = useState(PAYSTACK_FEE_PERCENT);
  const [packagingCost, setPackagingCost] = useState(PACKAGING_COST_PER_ORDER);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllOrders(res.data);
      } catch {
        console.error("Failed to fetch orders");
      } finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const orders = filterByPeriod(allOrders, period);
  const paidOrders = orders.filter((o) => o.paymentStatus?.toLowerCase() === "paid");

  const totalRevenue = paidOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0;

  const totalCOGS = paidOrders.reduce((s, o) =>
    s + (o.items || []).reduce((ss, i) => ss + (i.cost || 0) * (i.quantity || 1), 0), 0);
  const totalShipping = paidOrders.reduce((s, o) => s + (o.shippingCost || 0), 0);
  const totalPaystackFees = totalRevenue * (paystackFee / 100);
  const totalPackaging = paidOrders.length * packagingCost;
  const totalExpenses = totalCOGS + totalShipping + totalPaystackFees + totalPackaging;
  const netProfit = totalRevenue - totalExpenses;

  const chartData = getLast12Months(allOrders);
  const topProducts = getTopProducts(orders);
  const revenueSparkline = chartData.map((d) => d.revenue);

  const PERIODS = ["daily", "weekly", "monthly", "all time"];

  const statCards = [
    { label: "Total Revenue", value: fmt(totalRevenue), sub: `${paidOrders.length} paid orders`, color: "#3A9D23", bg: "#f0fdf4", spark: revenueSparkline },
    { label: "Total Orders", value: totalOrders, sub: `${paidOrders.length} paid · ${orders.length - paidOrders.length} pending`, color: "#1d4ed8", bg: "#eff6ff", spark: chartData.map(d => d.orders) },
    { label: "Net Profit", value: fmt(netProfit), sub: `${pct(netProfit, totalRevenue)} margin`, color: netProfit >= 0 ? "#16a34a" : "#dc2626", bg: netProfit >= 0 ? "#f0fdf4" : "#fef2f2", spark: chartData.map(d => d.profit) },
    { label: "Avg Order Value", value: fmt(avgOrderValue), sub: "per paid order", color: "#7c3aed", bg: "#f5f3ff", spark: [] },
  ];

  if (loading) return (
    <div className="ap">
      <div className="ap-topbar"><h1>Sales Report</h1></div>
      <div className="ap-body"><div className="ap-empty">Loading report...</div></div>
    </div>
  );

  return (
    <div className="ap">
      <div className="ap-topbar">
        <h1>Sales Report</h1>
        <div className="ap-breadcrumb">🏠 Home &rsaquo; <span>Sales Report</span></div>
      </div>

      <div className="ap-body">

        {/* Period Filter + Export */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {PERIODS.map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "7px 16px", borderRadius: 8, border: "1.5px solid",
                borderColor: period === p ? "#3A9D23" : "#e5e7eb",
                background: period === p ? "#3A9D23" : "#fff",
                color: period === p ? "#fff" : "#374151",
                fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
                transition: "all 0.2s",
              }}>{p}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => exportCSV(allOrders, period)} style={{
              padding: "7px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb",
              background: "#fff", color: "#374151", fontSize: "0.8rem",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <i className="fa-solid fa-download" style={{ fontSize: 12 }}></i> CSV
            </button>
            <button onClick={() => exportExcel(allOrders, period)} style={{
              padding: "7px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb",
              background: "#fff", color: "#374151", fontSize: "0.8rem",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <i className="fa-solid fa-file-excel" style={{ fontSize: 12, color: "#16a34a" }}></i> Excel
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {statCards.map((card) => (
            <div key={card.label} style={{
              background: "#fff", borderRadius: 12, padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderLeft: `4px solid ${card.color}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 6 }}>{card.sub}</div>
                </div>
                {card.spark.length > 1 && <Sparkline data={card.spark} color={card.color} />}
              </div>
            </div>
          ))}
        </div>

        {/* Expense Breakdown + Settings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 24 }}>

          {/* Expense Breakdown */}
          <div className="ap-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>Expense Breakdown</h2>
            {[
              { label: "Cost of Goods (COGS)", value: totalCOGS, color: "#dc2626" },
              { label: `Paystack Fees (${paystackFee}%)`, value: totalPaystackFees, color: "#ea580c" },
              { label: `Packaging (₦${packagingCost.toLocaleString()}/order)`, value: totalPackaging, color: "#ca8a04" },
              { label: "Shipping Costs", value: totalShipping, color: "#7c3aed" },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.83rem", color: "#374151", fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: "0.83rem", fontWeight: 600, color: item.color }}>{fmt(item.value)}</span>
                </div>
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999 }}>
                  <div style={{
                    height: "100%", borderRadius: 999, background: item.color,
                    width: totalExpenses ? `${(item.value / totalExpenses) * 100}%` : "0%",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>Total Expenses</span>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#dc2626" }}>{fmt(totalExpenses)}</span>
            </div>
          </div>

          {/* Settings */}
          <div className="ap-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>Cost Settings</h2>
            <div style={{ marginBottom: 16 }}>
              <div className="field-label">Paystack Fee (%)</div>
              <input className="ap-input" type="number" step="0.1" min="0" max="10"
                value={paystackFee}
                onChange={(e) => setPaystackFee(+e.target.value)} />
              <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>
                Applied as % of total revenue
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="field-label">Packaging Cost per Order (₦)</div>
              <input className="ap-input" type="number" min="0"
                value={packagingCost}
                onChange={(e) => setPackagingCost(+e.target.value)} />
              <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>
                Fixed cost applied per order
              </div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Profit Summary</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.82rem", color: "#374151" }}>Revenue</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#3A9D23" }}>{fmt(totalRevenue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.82rem", color: "#374151" }}>Expenses</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#dc2626" }}>- {fmt(totalExpenses)}</span>
              </div>
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>Net Profit</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: netProfit >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(netProfit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="ap-card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>Monthly Revenue & Profit (Last 12 Months)</h2>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#6b7280" }}>
                <div style={{ width: 12, height: 12, background: "#3A9D23", borderRadius: 2 }} /> Revenue
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#6b7280" }}>
                <div style={{ width: 12, height: 12, background: "#86efac", borderRadius: 2 }} /> Profit
              </div>
            </div>
          </div>
          <BarChart data={chartData} />
        </div>

        {/* Top Products */}
        <div className="ap-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>Top Selling Products</h2>
          </div>
          {topProducts.length === 0 ? (
            <div className="ap-empty">No product data for this period.</div>
          ) : (
            <table className="ap-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty Sold</th>
                  <th>Revenue</th>
                  <th>COGS</th>
                  <th>Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.name}>
                    <td style={{ color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.qty}</td>
                    <td style={{ color: "#3A9D23", fontWeight: 600 }}>{fmt(p.revenue)}</td>
                    <td style={{ color: "#dc2626" }}>{fmt(p.cost)}</td>
                    <td style={{ color: p.profit >= 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{fmt(p.profit)}</td>
                    <td>
                      <span style={{
                        background: p.profit >= 0 ? "#dcfce7" : "#fee2e2",
                        color: p.profit >= 0 ? "#16a34a" : "#dc2626",
                        padding: "3px 8px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600,
                      }}>{pct(p.profit, p.revenue)}</span>
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
