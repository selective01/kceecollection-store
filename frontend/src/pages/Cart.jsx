// Cart.jsx — Redesigned
// Layout: two-column — item list left, order summary right (sticky)
// Style: clean white cards, promo code input, quantity stepper buttons
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import Toast from "../components/Toast";
import SEO from "../components/SEO";
import "../assets/css/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems, removeFromCart, clearCart,
    updateQuantity, subtotal, totalItems, toastMessage,
  } = useCart();

  return (
    <>
      <SEO
        title="Cart"
        description="View and manage your shopping cart at Kcee Collection."
        image="https://Kcee_Collection.com/og-image.jpg"
        url="https://Kcee_Collection.com/cart"
      />
      <Toast message={toastMessage} />

      <div className="cart-shell">
        {/* Page title */}
        <div className="cart-page-head">
          <h1 className="cart-page-title">Your Cart</h1>
          {cartItems.length > 0 && (
            <span className="cart-page-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ── Empty state ── */
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <i className="fas fa-shopping-cart" />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button className="cart-shop-btn" onClick={() => navigate("/")}>
              Start Shopping →
            </button>
          </div>
        ) : (
          <div className="cart-body">
            {/* ── LEFT: item list ── */}
            <div className="cart-items-col">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={`${item.id}-${item.size}`}>
                  {/* Delete btn */}
                  <button
                    className="cart-item-delete"
                    onClick={() => removeFromCart(item.id, item.size)}
                    aria-label="Remove item"
                  >
                    <i className="fas fa-trash" />
                  </button>

                  {/* Image */}
                  <div className="cart-item-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <div className="cart-item-meta">
                      {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    </div>
                    <p className="cart-item-unit-price">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity stepper */}
                  <div className="cart-item-right">
                    <div className="cart-stepper">
                      <button
                        className="cart-step-btn"
                        onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease"
                      >−</button>
                      <span className="cart-step-qty">{item.quantity}</span>
                      <button
                        className="cart-step-btn"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label="Increase"
                      >+</button>
                    </div>
                    <p className="cart-item-total">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear cart link */}
              <button className="cart-clear-link" onClick={clearCart}>
                <i className="fas fa-times" /> Clear all items
              </button>
            </div>

            {/* ── RIGHT: order summary ── */}
            <div className="cart-summary-col">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">Order Summary</h2>

                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span className="cart-summary-muted">Calculated at checkout</span>
                  </div>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-row cart-summary-total">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                <p className="cart-summary-note">
                  Tax and delivery calculated at checkout
                </p>

                <button
                  className="cart-checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  Go to Checkout &nbsp;→
                </button>

                <button
                  className="cart-continue-btn"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
