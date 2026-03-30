import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/* =========================
   HELPER
========================= */
const send = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("Email send error:", err);
  }
};

/* =========================
   USER: Order Confirmation
========================= */
export const sendOrderConfirmation = async (order) => {
  const itemsHtml = (order.items || []).map((item) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f1f5f9">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #f1f5f9;text-align:center">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #f1f5f9;text-align:right">₦${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

  await send({
    to: order.customer?.email,
    subject: `Order Confirmed – #${order.reference || order._id}`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:#3A9D23;padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Order Confirmed! 🎉</h1>
          <p style="color:#dcfce7;margin:8px 0 0;font-size:14px">Thank you for shopping with Kcee_Collection</p>
        </div>
        <div style="padding:32px">
          <p style="color:#374151;font-size:15px">Hi <strong>${order.customer?.fullName || "Customer"}</strong>,</p>
          <p style="color:#6b7280;font-size:14px">We've received your order and it's being processed. Here's your order summary:</p>
          <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-size:13px;color:#6b7280">Order Reference</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#0f172a">#${order.reference || order._id}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <thead>
              <tr style="background:#f8fafc">
                <th style="padding:10px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Item</th>
                <th style="padding:10px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">Qty</th>
                <th style="padding:10px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="border-top:2px solid #f1f5f9;padding-top:16px;text-align:right">
            <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a">Total: ₦${(order.totalPrice || 0).toLocaleString()}</p>
          </div>
          <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#16a34a">Delivery Address</p>
            <p style="margin:0;font-size:13px;color:#374151">${order.customer?.address || ""}, ${order.customer?.state || ""}, ${order.customer?.country || ""}</p>
          </div>
          <p style="color:#6b7280;font-size:13px">You'll receive another email when your order ships. For any questions, contact us at kceecollection01@gmail.com</p>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">© Kcee_Collection • Bold Urban Fashion</p>
        </div>
      </div>
    `,
  });
};

/* =========================
   USER: Payment Confirmation
========================= */
export const sendPaymentConfirmation = async (order) => {
  await send({
    to: order.customer?.email,
    subject: `Payment Received – #${order.reference || order._id}`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:#1d4ed8;padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Payment Confirmed ✅</h1>
          <p style="color:#dbeafe;margin:8px 0 0;font-size:14px">Your payment has been successfully processed</p>
        </div>
        <div style="padding:32px">
          <p style="color:#374151;font-size:15px">Hi <strong>${order.customer?.fullName || "Customer"}</strong>,</p>
          <p style="color:#6b7280;font-size:14px">We've confirmed your payment of <strong>₦${(order.totalPrice || 0).toLocaleString()}</strong> for order <strong>#${order.reference || order._id}</strong>.</p>
          <div style="background:#dbeafe;border-radius:8px;padding:20px;margin:20px 0;text-align:center">
            <p style="margin:0 0 4px;font-size:13px;color:#1d4ed8;font-weight:600">Amount Paid</p>
            <p style="margin:0;font-size:28px;font-weight:700;color:#1d4ed8">₦${(order.totalPrice || 0).toLocaleString()}</p>
          </div>
          <p style="color:#6b7280;font-size:13px">Your order is now being prepared. We'll notify you once it ships.</p>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">© Kcee_Collection • Bold Urban Fashion</p>
        </div>
      </div>
    `,
  });
};

/* =========================
   USER: Order Status Update
========================= */
export const sendStatusUpdate = async (order) => {
  const statusColors = {
    shipped: { bg: "#7c3aed", light: "#f5f3ff", text: "#7c3aed" },
    delivered: { bg: "#16a34a", light: "#f0fdf4", text: "#16a34a" },
    pending: { bg: "#ca8a04", light: "#fefce8", text: "#ca8a04" },
  };
  const colors = statusColors[order.status?.toLowerCase()] || statusColors.pending;
  const statusMessages = {
    shipped: "Great news! Your order is on its way 🚚",
    delivered: "Your order has been delivered! 📦",
    pending: "Your order status has been updated.",
  };

  await send({
    to: order.customer?.email,
    subject: `Order Update: ${order.status} – #${order.reference || order._id}`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:${colors.bg};padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Order ${order.status}</h1>
          <p style="color:#fff;opacity:0.85;margin:8px 0 0;font-size:14px">${statusMessages[order.status?.toLowerCase()] || "Your order status has been updated."}</p>
        </div>
        <div style="padding:32px">
          <p style="color:#374151;font-size:15px">Hi <strong>${order.customer?.fullName || "Customer"}</strong>,</p>
          <div style="background:${colors.light};border-radius:8px;padding:20px;margin:20px 0;text-align:center">
            <p style="margin:0 0 4px;font-size:13px;color:${colors.text};font-weight:600">Current Status</p>
            <p style="margin:0;font-size:22px;font-weight:700;color:${colors.text};text-transform:capitalize">${order.status}</p>
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af">Order Reference</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a">#${order.reference || order._id}</p>
          </div>
          <p style="color:#6b7280;font-size:13px">For any questions, contact us at Kcee_Collection01@gmail.com</p>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">© Kcee_Collection • Bold Urban Fashion</p>
        </div>
      </div>
    `,
  });
};

/* =========================
   ADMIN: New Order Alert
========================= */
export const sendAdminNewOrderAlert = async (order) => {
  const itemsHtml = (order.items || []).map((item) =>
    `<li style="margin-bottom:4px;font-size:13px;color:#374151">${item.name} × ${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}</li>`
  ).join("");

  await send({
    to: ADMIN_EMAIL,
    subject: `🛒 New Order – ₦${(order.totalPrice || 0).toLocaleString()} from ${order.customer?.fullName || "Customer"}`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:#0f172a;padding:28px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">New Order Received 🛒</h1>
        </div>
        <div style="padding:28px">
          <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
            <div style="flex:1;background:#f0fdf4;border-radius:8px;padding:16px;min-width:140px">
              <p style="margin:0 0 4px;font-size:11px;color:#16a34a;font-weight:600;text-transform:uppercase">Total</p>
              <p style="margin:0;font-size:20px;font-weight:700;color:#0f172a">₦${(order.totalPrice || 0).toLocaleString()}</p>
            </div>
            <div style="flex:1;background:#f8fafc;border-radius:8px;padding:16px;min-width:140px">
              <p style="margin:0 0 4px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase">Reference</p>
              <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a">#${order.reference || order._id}</p>
            </div>
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px">
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase">Customer</p>
            <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#0f172a">${order.customer?.fullName || "—"}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280">${order.customer?.email || "—"}</p>
            <p style="margin:0;font-size:13px;color:#6b7280">${order.customer?.phone || "—"}</p>
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px">
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase">Items Ordered</p>
            <ul style="margin:0;padding-left:16px">${itemsHtml}</ul>
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:16px">
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase">Delivery Address</p>
            <p style="margin:0;font-size:13px;color:#374151">${order.customer?.address || ""}, ${order.customer?.state || ""}, ${order.customer?.country || ""}</p>
          </div>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">Kcee_Collection Admin Notification</p>
        </div>
      </div>
    `,
  });
};

/* =========================
   ADMIN: Low Stock Alert
========================= */
export const sendLowStockAlert = async (product) => {
  await send({
    to: ADMIN_EMAIL,
    subject: `⚠️ Low Stock Alert – ${product.name}`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:#ea580c;padding:28px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">⚠️ Low Stock Alert</h1>
        </div>
        <div style="padding:28px">
          <div style="background:#fff7ed;border-radius:8px;padding:20px;text-align:center">
            <p style="margin:0 0 8px;font-size:14px;color:#ea580c;font-weight:600">${product.name}</p>
            <p style="margin:0;font-size:32px;font-weight:700;color:#ea580c">${product.stock} left</p>
            <p style="margin:8px 0 0;font-size:13px;color:#9a3412">Stock is running low. Please restock soon.</p>
          </div>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">Kcee_Collection Admin Notification</p>
        </div>
      </div>
    `,
  });
};

/* =========================
   ADMIN: Payment Received Alert
========================= */
export const sendAdminPaymentAlert = async (order) => {
  await send({
    to: ADMIN_EMAIL,
    subject: `💰 Payment Received – ₦${(order.totalPrice || 0).toLocaleString()}`,
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:#16a34a;padding:28px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">💰 Payment Received</h1>
        </div>
        <div style="padding:28px">
          <div style="background:#f0fdf4;border-radius:8px;padding:20px;text-align:center;margin-bottom:16px">
            <p style="margin:0 0 4px;font-size:13px;color:#16a34a;font-weight:600">Amount Received</p>
            <p style="margin:0;font-size:32px;font-weight:700;color:#16a34a">₦${(order.totalPrice || 0).toLocaleString()}</p>
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:16px">
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af">From</p>
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a">${order.customer?.fullName || "—"} (${order.customer?.email || "—"})</p>
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af">Reference</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">#${order.reference || order._id}</p>
          </div>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">Kcee_Collection Admin Notification</p>
        </div>
      </div>
    `,
  });
};
