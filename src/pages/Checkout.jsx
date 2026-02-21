import { useState } from "react";
import { useCart } from "../hooks/useCart";
import "../assets/css/checkout.css";

const countryStateData = {
  Nigeria: [
    "Lagos",
    "Abuja (FCT)",
    "Rivers",
    "Oyo",
    "Kano",
    "Enugu",
  ],
  "United States": [
    "California",
    "Texas",
    "New York",
  ],
};

const shippingFees = {
  Nigeria: {
    Lagos: 2000,
    "Abuja (FCT)": 3000,
    Rivers: 3500,
    Oyo: 3000,
    Kano: 4000,
    Enugu: 3000,
  },
  "United States": 15000, // flat international rate
};

export default function Checkout() {
  const { cart, total } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    postalCode: "",
  });

  const [shipping, setShipping] = useState(0);
  const grandTotal = total + shipping;

  const [errors, setErrors] = useState({});

  const isFormValid =
  Object.values(errors).every((err) => !err) &&
  formData.fullName &&
  formData.email &&
  formData.phone &&
  formData.address &&
  formData.country &&
  formData.state;

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        break;

      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value))
          return "Invalid email address";
        break;

      case "phone":
        if (!value) return "Phone number is required";
        if (!/^[0-9]{11}$/.test(value))
          return "Phone must be 11 digits";
        break;

      case "address":
        if (!value.trim()) return "Address is required";
        break;

      case "country":
        if (!value) return "Country is required";
        break;

      case "state":
        if (!value) return "State is required";
        break;

      case "postalCode":
        if (!value.trim()) return "Postal code is required";
        break;

      default:
        return "";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...formData, [name]: value };

    if (name === "country") {
      updatedForm = { ...updatedForm, state: "" };
      setShipping(0);
    }

    if (name === "state") {
      if (updatedForm.country === "Nigeria") {
        setShipping(shippingFees.Nigeria[value] || 0);
      } else if (updatedForm.country === "United States") {
        setShipping(shippingFees["United States"]);
      }
    }

    setFormData(updatedForm);

    // 🔥 Real-time validation
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.querySelector(
        `[name="${firstErrorKey}"]`
      );
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (cart.length === 0) return;

    alert("Order placed successfully!");
  };

  return (
    <section className="checkout-section">
      <div className="checkout-container">

        {/* LEFT SIDE */}
        <form onSubmit={handleSubmit} className="checkout-left">
          <h2>Billing Details</h2>

          <div className="form-group">
            <label>Full Name*</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={
                  errors.fullName
                    ? "input-error"
                    : formData.fullName
                    && !errors.fullName
                }
              />
              {!errors.fullName && formData.fullName && (
                <span className="checkmark">✓</span>
              )}
            </div>
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Email Address*</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={
                  errors.email
                    ? "input-error"
                    : formData.email
                    && !errors.email
                }
              />
              {!errors.email && formData.email && (
                <span className="checkmark">✓</span>
              )}
            </div>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number*</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={
                  errors.phone
                    ? "input-error"
                    : formData.phone && !errors.phone
                    && !errors.phone
                }
              />
              {!errors.phone && formData.phone && (
                <span className="checkmark">✓</span>
              )}
            </div>
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Address*</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your home address"
                className={
                  errors.address
                    ? "input-error"
                    : formData.address
                    && !errors.address
                }
              />
              {!errors.address && formData.address && (
                <span className="checkmark">✓</span>
              )}
            </div>
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Country*</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              {Object.keys(countryStateData).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && <span className="error">{errors.country}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State*</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={!formData.country}
              >
                <option value="">Select State</option>

                {formData.country &&
                  countryStateData[formData.country].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
              </select>
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <div className="input-wrapper">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={
                  errors.postalCode
                    ? "input-error"
                    : formData.postalCode
                    && !errors.postalCode
                }
              />
              {!errors.postalCode && formData.postalCode && (
                <span className="checkmark">✓</span>
              )}
            </div>
            </div>
          </div>
        </form>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h2>Your Order</h2>

          {cart.map((item, index) => (
            <div className="order-item" key={index}>
              <div>
                <p className="product-name">{item.name}</p>
                <p className="product-meta">
                  Size: {item.size || "-"} × {item.quantity}
                </p>
              </div>
              <p className="price">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}

          <div className="order-summary">
            <h3>Order Summary</h3>

            <p class="subtotal">Subtotal: ₦{total.toLocaleString()}</p>
            <p class="shipping">Shipping: ₦{shipping.toLocaleString()}</p>

            <hr />

            <h4>Total: ₦{grandTotal.toLocaleString()}</h4>
          </div>

          <button
            onClick={handleSubmit}
            type="button"
            className="place-order-btn"
            disabled={!isFormValid}
          >
            Place Order
          </button>
        </div>

      </div>
    </section>
  );
}