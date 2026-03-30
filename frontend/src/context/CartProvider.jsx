// CartProvider.jsx — only exports the CartProvider component
import { useState, useCallback, useEffect, useRef } from "react";
import { CartContext } from "./cartContext";
import { fetchCartFromDB, saveCartToDB, clearCartInDB } from "../utils/cartApi";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast]         = useState(null);
  const toastTimerRef             = useRef(null);
  const prevTokenRef              = useRef(localStorage.getItem("token"));
  const isMounted                 = useRef(true);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message ? { message, type } : null);
    if (message) {
      toastTimerRef.current = setTimeout(() => {
        if (isMounted.current) setToast(null);
      }, duration);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (localStorage.getItem("token")) {
      fetchCartFromDB().then((items) => {
        if (isMounted.current) setCartItems(items);
      });
    }
    return () => {
      isMounted.current = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      const prevToken    = prevTokenRef.current;
      if (currentToken && !prevToken) {
        prevTokenRef.current = currentToken;
        fetchCartFromDB().then((items) => {
          if (isMounted.current) setCartItems(items);
        });
      } else if (!currentToken && prevToken) {
        prevTokenRef.current = null;
        setCartItems([]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === product.size
      );
      const updated = existing
        ? prev.map((item) =>
            item.id === product.id && item.size === product.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
      saveCartToDB(updated);
      return updated;
    });
    showToast(`${product.name} added to cart!`, "success");
  }, [showToast]);

  const removeFromCart = useCallback((id, size) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => !(item.id === id && item.size === size));
      saveCartToDB(updated);
      return updated;
    });
    showToast("Item removed from cart", "info");
  }, [showToast]);

  const updateQuantity = useCallback((id, size, quantity) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      );
      saveCartToDB(updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    clearCartInDB();
  }, []);

  const subtotal   = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        toast,
        showToast,
        toastMessage: toast?.message ?? "",
        setToastMessage: (msg) => msg ? showToast(msg, "success") : setToast(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
