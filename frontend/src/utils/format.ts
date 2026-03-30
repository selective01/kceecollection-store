// format.ts — shared formatting helpers used across user and admin pages

// Format a number as Nigerian Naira
// formatCurrency(15000) → "₦15,000"
export const formatCurrency = (amount: number): string =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

// Format a date string into readable format
// formatDate("2026-03-15T10:30:00Z") → "Mar 15, 2026"
export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });

// Format a date with time
// formatDateTime("2026-03-15T10:30:00Z") → "Mar 15, 2026 · 10:30 AM"
export const formatDateTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}`;
};

// Map order status to a colour class for badge styling
export const statusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending:    "status-pending",
    processing: "status-processing",
    shipped:    "status-shipped",
    delivered:  "status-delivered",
    cancelled:  "status-cancelled",
  };
  return map[status?.toLowerCase()] ?? "status-pending";
};

// Truncate long text with ellipsis
// truncate("Hello World", 8) → "Hello Wo..."
export const truncate = (text: string, max = 40): string =>
  text?.length > max ? `${text.slice(0, max)}...` : text;
