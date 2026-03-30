// Checkout.jsx — Redesigned
// Layout: step indicator top, shipping form left, order summary right
// Style: clean, minimal, professional — matching reference design
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import SEO from "../components/SEO";
import "../assets/css/checkout.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    address: "", country: "Nigeria", state: "", postalCode: "",
  });
  const [shippingRates, setShippingRates]       = useState([]);
  const [selectedRate, setSelectedRate]         = useState(null);
  const [shippingLoading, setShippingLoading]   = useState(false);
  const [orderLoading, setOrderLoading]         = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const step = 1; // static indicator — payment launches inline via Paystack

  // Coupon
  const [couponCode, setCouponCode]       = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg]         = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const discount   = appliedCoupon?.discount || 0;
  const shipping   = selectedRate?.price || 0;
  const grandTotal = Math.max(0, subtotal + shipping - discount);

  const grandTotalRef    = useRef(grandTotal);
  const formRef          = useRef(form);
  const selectedRateRef  = useRef(selectedRate);
  const cartItemsRef     = useRef(cartItems);
  const appliedCouponRef = useRef(appliedCoupon);

  useEffect(() => { grandTotalRef.current    = grandTotal;    }, [grandTotal]);
  useEffect(() => { formRef.current          = form;          }, [form]);
  useEffect(() => { selectedRateRef.current  = selectedRate;  }, [selectedRate]);
  useEffect(() => { cartItemsRef.current     = cartItems;     }, [cartItems]);
  useEffect(() => { appliedCouponRef.current = appliedCoupon; }, [appliedCoupon]);

  // Autofill from user profile
  useEffect(() => {
    if (loading) return;
    if (!user) { alert("Please log in to checkout."); navigate("/auth"); return; }
    setForm((f) => ({
      ...f,
      fullName: f.fullName || user.name || "",
      email:    f.email    || user.email || "",
      phone:    f.phone    || user.phone || "",
    }));
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (["state", "country"].includes(e.target.name)) {
      setShippingRates([]); setSelectedRate(null); setShippingCalculated(false);
    }
  };

  const calculateShipping = async () => {
    if (!form.state) { alert("Please select a state first."); return; }
    setShippingLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/shipping/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: form.state, country: form.country,
          items: cartItems.map((i) => ({ weight: i.weight || 0.5, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      setShippingRates(data.rates || []);
      setSelectedRate(data.rates?.[0] || null);
      setShippingCalculated(true);
    } catch { alert("Failed to calculate shipping. Try again."); }
    finally { setShippingLoading(false); }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true); setCouponMsg(null);
    try {
      const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponMsg({ ok: false, text: data.msg || "Invalid coupon" });
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({ code: data.coupon.code, discount: data.discount });
        setCouponMsg({ ok: true, text: `"${data.coupon.code}" — ₦${data.discount.toLocaleString()} off!` });
      }
    } catch { setCouponMsg({ ok: false, text: "Failed to validate coupon." }); }
    finally { setCouponLoading(false); }
  };

  const isFormValid = () => {
    const { fullName, email, phone, address, country, state } = form;
    if (!fullName || !email || !phone || !address || !country || !state) {
      alert("Please fill in all required fields."); return false;
    }
    if (!cartItems.length) { alert("Your cart is empty."); return false; }
    if (!selectedRate) { alert("Please select a shipping option."); return false; }
    return true;
  };

  const handleSuccess = async (reference) => {
    setOrderLoading(true);
    try {
      const verifyRes = await fetch(`${BASE_URL}/api/paystack/verify/${reference}`);
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        alert("Payment verification failed. Reference: " + reference); return;
      }
      const token = localStorage.getItem("token");
      const orderRes = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cartItemsRef.current.map((item) => ({
            productId: item._id || item.id,
            name: item.name, image: item.image, size: item.size,
            quantity: item.quantity, price: item.price, weight: item.weight || 0.5,
          })),
          totalPrice: grandTotalRef.current,
          paymentStatus: "Paid",
          reference,
          customer: formRef.current,
          shippingCost: selectedRateRef.current?.price || 0,
          shippingProvider: selectedRateRef.current?.provider,
          couponCode: appliedCouponRef.current?.code || null,
          discount: appliedCouponRef.current?.discount || 0,
        }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        alert(`Payment received but order failed. Reference: ${reference}`);
        console.error(err); return;
      }
      if (appliedCouponRef.current?.code) {
        fetch(`${BASE_URL}/api/coupons/redeem`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: appliedCouponRef.current.code }),
        }).catch(console.error);
      }
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Contact support with reference: " + reference);
    } finally { setOrderLoading(false); }
  };

  const handlePayment = () => {
    if (!isFormValid()) return;
    if (!window.PaystackPop) { alert("Payment system loading. Try again."); return; }
    const handler = new window.PaystackPop();
    handler.newTransaction({
      key:      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email:    form.email,
      amount:   grandTotal * 100,
      currency: "NGN",
      ref:      `T${Date.now()}`,
      onSuccess: (tx) => handleSuccess(tx.reference || tx.trxref),
      onCancel:  () => {},
    });
  };

  return (
    <section className="co-shell">
      <SEO title="Checkout" description="Complete your order at Kcee Collection." url="https://Kcee_Collection.com/checkout" />

      {/* ── Step indicator ── */}
      <div className="co-steps">
        <div className={`co-step ${step >= 1 ? "co-step-active" : ""}`}>
          <span className="co-step-num">1</span>
          <span className="co-step-label">Shipping</span>
        </div>
        <div className="co-step-line" />
        <div className={`co-step ${step >= 2 ? "co-step-active" : ""}`}>
          <span className="co-step-num">2</span>
          <span className="co-step-label">Payment</span>
        </div>
        <div className="co-step-line" />
        <div className={`co-step ${step >= 3 ? "co-step-active" : ""}`}>
          <span className="co-step-num">3</span>
          <span className="co-step-label">Finish</span>
        </div>
      </div>

      <div className="co-body">
        {/* ── LEFT: form ── */}
        <div className="co-form-col">
          <div className="co-card">
            <h2 className="co-section-title">Contact Information</h2>
            <div className="co-form-grid co-grid-2">
              <div className="co-field">
                <label className="co-label">Email Address *</label>
                <input className="co-input" type="email" name="email"
                  placeholder="example@gmail.com" value={form.email} onChange={handleChange} />
                <p className="co-hint">We'll send order updates to this email</p>
              </div>
              <div className="co-field">
                <label className="co-label">Phone Number *</label>
                <input className="co-input" type="tel" name="phone"
                  placeholder="+234 000 000 0000" value={form.phone} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="co-card">
            <h2 className="co-section-title">Shipping Address</h2>
            <div className="co-form-grid co-grid-2">
              <div className="co-field">
                <label className="co-label">Full Name *</label>
                <input className="co-input" name="fullName"
                  placeholder="Enter your full name" value={form.fullName} onChange={handleChange} />
              </div>
              <div className="co-field">
                <label className="co-label">State *</label>
                <select className="co-input co-select" name="state" value={form.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="co-field co-full">
                <label className="co-label">Street Address *</label>
                <input className="co-input" name="address"
                  placeholder="Enter your street address" value={form.address} onChange={handleChange} />
              </div>
              <div className="co-field">
                <label className="co-label">Country</label>
                <input className="co-input" name="country" value={form.country} onChange={handleChange} />
              </div>
              <div className="co-field">
                <label className="co-label">Postal Code</label>
                <input className="co-input" name="postalCode"
                  placeholder="Optional" value={form.postalCode} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Shipping method */}
          <div className="co-card">
            <h2 className="co-section-title">Shipping Method</h2>
            <button
              className="co-calc-btn"
              onClick={calculateShipping}
              disabled={shippingLoading || !form.state}
            >
              {shippingLoading
                ? "Calculating..."
                : shippingCalculated
                ? "✓ Calculated — Recalculate"
                : "Calculate Shipping Rates"}
            </button>

            {shippingRates.length > 0 && (
              <div className="co-rates">
                {shippingRates.map((rate, i) => (
                  <label
                    key={i}
                    className={`co-rate-option ${selectedRate?.provider === rate.provider ? "co-rate-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="shippingRate"
                      className="co-radio"
                      checked={selectedRate?.provider === rate.provider}
                      onChange={() => setSelectedRate(rate)}
                    />
                    <div className="co-rate-info">
                      <span className="co-rate-name">{rate.provider}</span>
                      <span className="co-rate-days">{rate.days}</span>
                    </div>
                    <span className="co-rate-price">
                      {rate.price === 0 ? "Free" : `₦${rate.price.toLocaleString()}`}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Continue button */}
          <button
            className="co-continue-btn"
            onClick={handlePayment}
            disabled={orderLoading || !shippingCalculated}
          >
            {orderLoading ? "Processing..." : "Continue to Payment →"}
          </button>
          {!shippingCalculated && (
            <p className="co-warning">
              ⚠ Select your state and calculate shipping to continue
            </p>
          )}
        </div>

        {/* ── RIGHT: order summary ── */}
        <div className="co-summary-col">
          <div className="co-card">
            <h2 className="co-section-title">Order Summary</h2>

            {/* Items */}
            <div className="co-summary-items">
              {cartItems.map((item, i) => (
                <div className="co-summary-item" key={i}>
                  <div className="co-summary-img-wrap">
                    <img src={item.image} alt={item.name} className="co-summary-img" />
                    <span className="co-summary-qty">{item.quantity}</span>
                  </div>
                  <div className="co-summary-item-info">
                    <p className="co-summary-name">{item.name}</p>
                    {item.size && <p className="co-summary-size">Size: {item.size}</p>}
                  </div>
                  <p className="co-summary-price">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <div className="co-coupon">
              <p className="co-coupon-label">Discount Code</p>
              {appliedCoupon ? (
                <div className="co-coupon-applied">
                  <span>
                    <i className="fas fa-tag" /> {appliedCoupon.code}
                    <span className="co-coupon-saving"> −₦{appliedCoupon.discount.toLocaleString()}</span>
                  </span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); setCouponMsg(null); }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="co-coupon-row">
                  <input
                    className="co-coupon-input"
                    placeholder="Enter your promo code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                  <button className="co-coupon-btn" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}>
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponMsg && (
                <p className={`co-coupon-msg ${couponMsg.ok ? "co-coupon-ok" : "co-coupon-err"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="co-totals">
              <div className="co-total-row">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="co-total-row">
                <span>Delivery Charge</span>
                <span>{shipping === 0 ? (shippingCalculated ? "Free" : "—") : `₦${shipping.toLocaleString()}`}</span>
              </div>
              {appliedCoupon && (
                <div className="co-total-row co-discount-row">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>−₦{appliedCoupon.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="co-total-divider" />
              <div className="co-total-row co-grand-total">
                <span>Total</span>
                <span className="co-grand-amount">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
