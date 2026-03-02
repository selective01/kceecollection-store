import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/checkout.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "",
    address: "", country: "", state: "", postalCode: "",
  });

  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);

  const shipping = selectedRate?.price || 0;
  const grandTotal = subtotal + shipping;

  useEffect(() => {
    if (loading) return;
    if (!user) { alert("Please log in to checkout."); navigate("/auth"); }
  }, [user, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (["state", "country"].includes(e.target.name)) {
      setShippingRates([]);
      setSelectedRate(null);
      setShippingCalculated(false);
    }
  };

  const calculateShipping = async () => {
    if (!formData.state && !formData.country) {
      alert("Please enter your city/state and country first.");
      return;
    }
    try {
      setShippingLoading(true);
      const res = await fetch(`${BASE_URL}/api/shipping/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: formData.state,
          country: formData.country,
          items: cartItems.map((item) => ({
            weight: item.weight || 0.5,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      setShippingRates(data.rates || []);
      setSelectedRate(data.rates?.[0] || null);
      setShippingCalculated(true);
    } catch {
      alert("Failed to calculate shipping. Please try again.");
    } finally {
      setShippingLoading(false);
    }
  };

  const isFormValid = () => {
    const { fullName, email, phone, address, country, state } = formData;
    if (!fullName || !email || !phone || !address || !country || !state) {
      alert("Please fill in all required fields before proceeding.");
      return false;
    }
    if (!cartItems.length) { alert("Your cart is empty."); return false; }
    if (!selectedRate) { alert("Please calculate and select a shipping option."); return false; }
    return true;
  };

  const handleSuccess = async (reference) => {
    try {
      setOrderLoading(true);
      await fetch(`${BASE_URL}/api/paystack/verify/${reference}`);
      const token = localStorage.getItem("token");
      const orderRes = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item._id || item.id,
            name: item.name,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            weight: item.weight || 0.5,
          })),
          totalPrice: grandTotal,
          paymentStatus: "Paid",
          reference,
          customer: formData,
          shippingCost: shipping,
          shippingProvider: selectedRate?.provider,
        }),
      });

      if (!orderRes.ok) {
        alert("Payment received but order could not be saved. Please contact support.");
        return;
      }

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("handleSuccess error:", error);
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePayment = () => {
    if (!isFormValid()) return;
    if (!window.PaystackPop) { alert("Payment system is still loading. Please try again."); return; }
    const handler = new window.PaystackPop();
    handler.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: grandTotal * 100,
      currency: "NGN",
      ref: `T${Date.now()}`,
      onSuccess: (transaction) => handleSuccess(transaction.reference || transaction.trxref),
      onCancel: () => alert("Payment cancelled."),
    });
  };

  return (
    <section className="checkout-section">
      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">
          <h2>Contact Information</h2>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" placeholder="Enter your email address"
              value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phone" placeholder="Enter your phone number"
              value={formData.phone} onChange={handleChange} />
          </div>

          <h2>Shipping Address</h2>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="fullName" placeholder="Enter your full name"
              value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" placeholder="Your current home address"
              value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>City / State:</label>
            <input type="text" name="state" placeholder="Your current city or state"
              value={formData.state} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" placeholder="Your country"
                value={formData.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Postal Code:</label>
              <input type="text" name="postalCode"
                value={formData.postalCode} onChange={handleChange} />
            </div>
          </div>

          {/* Calculate Shipping */}
          <button
            type="button"
            onClick={calculateShipping}
            disabled={shippingLoading}
            style={{
              width: "100%", padding: "11px", marginTop: 8,
              background: shippingCalculated ? "#f0fdf4" : "#0f172a",
              color: shippingCalculated ? "#16a34a" : "#fff",
              border: shippingCalculated ? "1.5px solid #86efac" : "none",
              borderRadius: 6, fontSize: "0.88rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            {shippingLoading
              ? "Calculating..."
              : shippingCalculated
              ? "✓ Shipping Calculated — Recalculate"
              : "Calculate Shipping"}
          </button>

          {/* Shipping Options */}
          {shippingRates.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Select Shipping Option:
              </p>
              {shippingRates.map((rate, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRate(rate)}
                  style={{
                    padding: "12px 14px", borderRadius: 8, marginBottom: 8, cursor: "pointer",
                    border: `1.5px solid ${selectedRate?.provider === rate.provider ? "#3A9D23" : "#e5e7eb"}`,
                    background: selectedRate?.provider === rate.provider ? "#f0fdf4" : "#fff",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>{rate.provider}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>{rate.days}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#3A9D23" }}>
                      ₦{rate.price.toLocaleString()}
                    </span>
                    {selectedRate?.provider === rate.provider && (
                      <i className="fa-solid fa-circle-check" style={{ color: "#3A9D23", fontSize: 16 }}></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <h2>Your Order</h2>
          {cartItems.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="order-left">
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="product-name">{item.name}</p>
                  <p className="product-meta">{item.size} × {item.quantity}</p>
                </div>
              </div>
              <p className="price">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}

          <div className="order-summary">
            <p>Subtotal <span>₦{subtotal.toLocaleString()}</span></p>
            <p>
              Shipping
              <span style={{ color: shipping === 0 ? "#9ca3af" : "#0f172a" }}>
                {shipping === 0
                  ? shippingCalculated ? "Free" : "—"
                  : `₦${shipping.toLocaleString()}`}
              </span>
            </p>
            {selectedRate && (
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: -6 }}>
                <span>{selectedRate.provider} · {selectedRate.days}</span>
                <span></span>
              </p>
            )}
            <hr />
            <h3>Total <span>₦{grandTotal.toLocaleString()}</span></h3>
          </div>

          {!shippingCalculated && (
            <p style={{ fontSize: "0.78rem", color: "#ea580c", marginTop: 8, textAlign: "center" }}>
              ⚠️ Enter your address and calculate shipping to proceed
            </p>
          )}

          <button
            className="place-order-btn"
            onClick={handlePayment}
            disabled={orderLoading || !shippingCalculated}
            style={{ opacity: !shippingCalculated ? 0.6 : 1 }}
          >
            {orderLoading ? "Processing..." : "Place Order"}
          </button>
        </div>

      </div>
    </section>
  );
}
