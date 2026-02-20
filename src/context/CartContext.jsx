import React, { createContext, useEffect, useState, useContext } from "react";

const CartContext = createContext();
const WHATSAPP_NUMBER = "2349137145633";

export const CartProvider = ({ children, currentUser }) => {
  // Generate localStorage key for each user or guest
  const getCartKey = (user) =>
    user ? `KceeCollection_Cart_${user.id}` : "KceeCollection_Guest";

  const [cart, setCart] = useState([]);

  // Load cart when component mounts or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Restore previous cart for this user
      const savedCart = JSON.parse(localStorage.getItem(getCartKey(currentUser))) || [];
      setCart(savedCart);
    } else {
      // Guest cart
      const guestCart = JSON.parse(localStorage.getItem(getCartKey(null))) || [];
      setCart(guestCart);
    }
  }, [currentUser]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getCartKey(currentUser), JSON.stringify(cart));
    } else {
      localStorage.setItem(getCartKey(null), JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    const id = Date.now();

    setToast({
      message,
      id: Date.now()
    });

    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2000);
  };


  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast("Added to cart ✅");
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Removed from cart ❌");
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared 🗑️");
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = () => {
    if (!cart.length) return alert("Your cart is empty!");

    let message = "Hello, I want to place an order from KceeCollection:%0A";
    cart.forEach((item) => {
      message += `- ${item.name} x${item.quantity} (${item.size || "N/A"}) = ₦${
        item.price * item.quantity
      }%0A`;
    });
    message += `Total: ₦${total}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        total,
        cartCount,
        checkout,
        toast, // <-- pass the correct variable here
        showToast, // optional if you want to trigger toast from other components
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
