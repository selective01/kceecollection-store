import React from "react";
import { useCart } from "../hooks/useCart";
import Toast from "../components/Toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/css/cart.css";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateQuantity,
    total,
    checkout,
    toastMessage,
  } = useCart();

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <Toast message={toastMessage} />

        <h1>Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-img"
                      />
                    </td>
                    <td>{item.size || "-"}</td>
                    <td>₦{item.price.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(index, Number(e.target.value))
                        }
                      />
                    </td>
                    <td>₦{(item.price * item.quantity).toLocaleString()}</td>
                    <td>
                      <span
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        &times;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <p>Total: ₦{total.toLocaleString()}</p>
              <div className="cart-btn-actions">
                <button
                  onClick={checkout}
                  className="checkout-btn"
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </button>
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Cart;
