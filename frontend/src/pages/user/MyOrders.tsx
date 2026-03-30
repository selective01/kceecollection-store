// MyOrders.tsx — Phase 2 Redesign
// Standalone orders page with search, filter, expandable items
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/format";
import "../../assets/css/myorders.css";
import { OrderTimeline } from '../../components/OrderTimeline';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
}

interface Order {
  _id: string;
  reference: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  customer?: {
    fullName: string;
    address: string;
    state: string;
    country: string;
  };
}

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const badgeClass = (status: string) => {
  const map: Record<string, string> = {
    pending: "mob-badge mob-pending",
    processing: "mob-badge mob-processing",
    shipped: "mob-badge mob-shipped",
    delivered: "mob-badge mob-delivered",
    cancelled: "mob-badge mob-cancelled",
    paid: "mob-badge mob-paid",
    unpaid: "mob-badge mob-unpaid",
  };
  return map[status?.toLowerCase()] ?? "mob-badge mob-pending";
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/auth"); return; }
    get<Order[]>("/orders/my")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = orders.filter((o) => {
    const matchFilter =
      filter === "All" || o.status?.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      !search ||
      o.reference?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="mob-shell">
      {/* Header */}
      <div className="mob-header">
        <Link to="/dashboard" className="mob-back">
          <i className="fas fa-arrow-left" /> Dashboard
        </Link>
        <h1 className="mob-title">My Orders</h1>
        <span className="mob-count">{orders.length} total</span>
      </div>

      {/* Search + Filter */}
      <div className="mob-controls">
        <div className="mob-search">
          <i className="fas fa-search" />
          <input
            placeholder="Search orders or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="mob-search-clear" onClick={() => setSearch("")}>
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="mob-filters">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`mob-filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="mob-loading">
          <div className="mob-spinner" />
          <p>Loading your orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mob-empty">
          <i className="fas fa-box-open" />
          <h3>{search || filter !== "All" ? "No matching orders" : "No orders yet"}</h3>
          <p>
            {search || filter !== "All"
              ? "Try a different search or filter."
              : "Once you place an order, it will appear here."}
          </p>
          <Link to="/" className="mob-cta">Browse Products</Link>
        </div>
      ) : (
        <div className="mob-list">
          {filtered.map((o) => {
            const isOpen = expanded.has(o._id);
            return (
              <div className="mob-card" key={o._id}>
                {/* Card header — always visible */}
                <div className="mob-card-head" onClick={() => toggle(o._id)}>
                  <div className="mob-card-head-left">
                    <div className="mob-order-icon">
                      <i className="fas fa-box" />
                    </div>
                    <div>
                      <p className="mob-ref">
                        #{o.reference?.slice(-10).toUpperCase() || o._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mob-date">{formatDate(o.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mob-card-head-right">
                    <p className="mob-amount">{formatCurrency(o.totalPrice)}</p>
                    <div className="mob-badge-row">
                      <span className={badgeClass(o.status)}>{o.status}</span>
                      <span className={badgeClass(o.paymentStatus)}>{o.paymentStatus}</span>
                    </div>
                    <i className={`fas fa-chevron-${isOpen ? "up" : "down"} mob-chevron`} />
                  </div>
                </div>

                {/* Expandable details */}
                {isOpen && (
                  <div className="mob-card-body">
                    {/* Order Timeline — top */}
                    <p className="mob-section-label">Order progress</p>
                    <OrderTimeline
                      status={o.status as "pending" | "paid" | "shipped" | "delivered"}
                      dates={{ pending: formatDate(o.createdAt) }}
                    />

                    {/* Items */}
                    <p className="mob-section-label">Items ordered</p>
                    <div className="mob-items">
                      {(o.items || []).map((item, i) => (
                        <div className="mob-item" key={i}>
                          {item.image ? (
                            <img className="mob-item-img" src={item.image} alt={item.name} />
                          ) : (
                            <div className="mob-item-img-ph">
                              <i className="fas fa-image" />
                            </div>
                          )}
                          <div className="mob-item-info">
                            <p className="mob-item-name">{item.name}</p>
                            <p className="mob-item-meta">
                              Qty: {item.quantity}
                              {item.size ? ` · Size: ${item.size}` : ""}
                            </p>
                          </div>
                          <p className="mob-item-price">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Delivery info */}
                    {o.customer && (
                      <>
                        <p className="mob-section-label">Delivery address</p>
                        <div className="mob-address">
                          <i className="fas fa-map-marker-alt" />
                          <p>
                            {o.customer.fullName} · {o.customer.address},{" "}
                            {o.customer.state}, {o.customer.country}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Total row */}
                    <div className="mob-total-row">
                      <span>Order Total</span>
                      <strong>{formatCurrency(o.totalPrice)}</strong>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
