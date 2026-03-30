// AdminDashboard.tsx — Phase 3 Upgrade
// Added: Revenue chart (Recharts), top products, order status breakdown
// Uses existing /api/orders endpoint — no new backend needed for the chart
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import "../../assets/css/adminDashboard.css";

interface Order {
  _id: string;
  reference?: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  customer?: { fullName: string; email: string };
}

interface Product {
  _id: string;
  name: string;
  stock: number;
  price: number;
  image?: string;
}

const PIE_COLORS: Record<string, string> = {
  pending:    "#f59e0b",
  processing: "#3b82f6",
  shipped:    "#8b5cf6",
  delivered:  "#10b981",
  cancelled:  "#ef4444",
};

// Build daily revenue for last 30 days
function buildRevenueData(orders: Order[]) {
  const now = new Date();
  const days: { date: string; revenue: number; orders: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    const dayOrders = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return (
        od.getFullYear() === d.getFullYear() &&
        od.getMonth()    === d.getMonth() &&
        od.getDate()     === d.getDate() &&
        o.paymentStatus?.toLowerCase() === "paid"
      );
    });
    days.push({
      date:    label,
      revenue: dayOrders.reduce((s, o) => s + (o.totalPrice || 0), 0),
      orders:  dayOrders.length,
    });
  }
  return days;
}

// Top 5 products by revenue from orders
function buildTopProducts(orders: Order[]) {
  const map: Record<string, { name: string; revenue: number; qty: number }> = {};
  for (const o of orders) {
    for (const item of o.items || []) {
      const key = item.name;
      if (!map[key]) map[key] = { name: key, revenue: 0, qty: 0 };
      map[key].revenue += (item.price || 0) * (item.quantity || 1);
      map[key].qty     += item.quantity || 1;
    }
  }
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export default function AdminDashboard() {
  const navigate   = useNavigate();
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [chartRange, setChartRange] = useState<7 | 14 | 30>(30);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/admin/login"); return; }

    Promise.all([
      get<Order[]>("/api/orders"),
      get<Product[]>("/api/products"),
    ])
      .then(([o, p]) => { setOrders(o); setProducts(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const stats = useMemo(() => {
    const paid    = orders.filter((o) => o.paymentStatus?.toLowerCase() === "paid");
    const pending = orders.filter((o) => o.status?.toLowerCase() === "pending");
    const revenue = paid.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const lowStock = products.filter((p) => p.stock >= 0 && p.stock <= 5).length;
    return { totalOrders: orders.length, revenue, pending: pending.length, lowStock };
  }, [orders, products]);

  const revenueData = useMemo(() => buildRevenueData(orders), [orders]);
  const chartData   = revenueData.slice(-chartRange);

  const topProducts = useMemo(() => buildTopProducts(orders), [orders]);

  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) {
      const s = o.status?.toLowerCase() || "pending";
      map[s] = (map[s] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const recentOrders = orders.slice(0, 8);

  const badgeClass = (s: string) => {
    const map: Record<string, string> = {
      pending: "dash-badge badge-pending", paid: "dash-badge badge-paid",
      shipped: "dash-badge badge-shipped", delivered: "dash-badge badge-delivered",
    };
    return map[s?.toLowerCase()] || "dash-badge badge-pending";
  };

  if (loading) {
    return (
      <div className="dash-wrapper">
        <div className="dash-loading">
          <div className="dash-spinner" /> Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dash-wrapper">
      {/* Top bar */}
      <div className="dash-topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="dash-breadcrumb">Admin / <span>Overview</span></p>
        </div>
        <p className="dash-date">{new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stat cards */}
      <div className="dash-cards">
        <div className="dash-card" style={{ background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)" }}>
          <div className="dash-card-body">
            <div>
              <p className="dash-card-value">{stats.totalOrders}</p>
              <p className="dash-card-label">Total Orders</p>
            </div>
            <div className="dash-card-icon">
              <svg viewBox="0 0 24 24" fill="white"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
          </div>
          <div className="dash-card-footer" onClick={() => navigate("/admin/orders")}>
            View all orders <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
          </div>
        </div>

        <div className="dash-card" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
          <div className="dash-card-body">
            <div>
              <p className="dash-card-value">{formatCurrency(stats.revenue)}</p>
              <p className="dash-card-label">Total Revenue</p>
            </div>
            <div className="dash-card-icon">
              <svg viewBox="0 0 24 24" fill="white"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div className="dash-card-footer" onClick={() => navigate("/admin/sales-report")}>
            View sales report <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
          </div>
        </div>

        <div className="dash-card" style={{ background: "linear-gradient(135deg,#d97706,#b45309)" }}>
          <div className="dash-card-body">
            <div>
              <p className="dash-card-value">{stats.pending}</p>
              <p className="dash-card-label">Pending Orders</p>
            </div>
            <div className="dash-card-icon">
              <svg viewBox="0 0 24 24" fill="white"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div className="dash-card-footer" onClick={() => navigate("/admin/orders")}>
            Process orders <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
          </div>
        </div>

        <div className="dash-card" style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)" }}>
          <div className="dash-card-body">
            <div>
              <p className="dash-card-value">{products.length}</p>
              <p className="dash-card-label">Products · {stats.lowStock} Low Stock</p>
            </div>
            <div className="dash-card-icon">
              <svg viewBox="0 0 24 24" fill="white"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
          </div>
          <div className="dash-card-footer" onClick={() => navigate("/admin/inventory")}>
            Manage inventory <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="dash-chart-section">
        <div className="dash-chart-card">
          <div className="dash-chart-head">
            <div>
              <h2 className="dash-chart-title">Revenue</h2>
              <p className="dash-chart-sub">Paid orders only</p>
            </div>
            <div className="dash-chart-range">
              {([7, 14, 30] as const).map((n) => (
                <button
                  key={n}
                  className={`dash-range-btn ${chartRange === n ? "active" : ""}`}
                  onClick={() => setChartRange(n)}
                >
                  {n}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1d4ed8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval={chartRange === 7 ? 0 : chartRange === 14 ? 1 : 4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1d4ed8"
                strokeWidth={2}
                fill="url(#revGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="dash-pie-card">
          <h2 className="dash-chart-title">Order Status</h2>
          <p className="dash-chart-sub">All time breakdown</p>
          {statusBreakdown.length === 0 ? (
            <div className="dash-no-data">No order data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusBreakdown.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[entry.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: "#374151", textTransform: "capitalize" }}>{v}</span>}
                />
                <Tooltip
                  formatter={(v: number, name: string) => [v, name.charAt(0).toUpperCase() + name.slice(1)]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom grid: recent orders + top products */}
      <div className="dash-bottom-grid">
        {/* Recent orders */}
        <div className="dash-recent">
          <div className="dash-recent-header">
            <span>Recent Orders</span>
            <button className="dash-view-all" onClick={() => navigate("/admin/orders")}>
              View all →
            </button>
          </div>
          <table className="dash-recent-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id}>
                  <td className="dash-ref">
                    #{o.reference?.slice(-8).toUpperCase() || o._id.slice(-6).toUpperCase()}
                  </td>
                  <td>{o.customer?.fullName || "—"}</td>
                  <td>{formatCurrency(o.totalPrice)}</td>
                  <td><span className={badgeClass(o.status)}>{o.status}</span></td>
                  <td>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="dash-empty-row">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Top products */}
        <div className="dash-top-products">
          <div className="dash-recent-header">
            <span>Top Products</span>
            <button className="dash-view-all" onClick={() => navigate("/admin/products")}>
              View all →
            </button>
          </div>
          <div className="dash-top-list">
            {topProducts.length === 0 ? (
              <div className="dash-no-data">No order data yet</div>
            ) : topProducts.map((p, i) => (
              <div key={i} className="dash-top-row">
                <span className="dash-top-rank">#{i + 1}</span>
                <div className="dash-top-info">
                  <p className="dash-top-name">{p.name}</p>
                  <p className="dash-top-qty">{p.qty} units sold</p>
                </div>
                <span className="dash-top-rev">{formatCurrency(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
