import { useReducer, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { WishlistContext } from "./WishlistContext";
import { getGuestWishlist, getToken, wishlistReducer, WISHLIST_KEY } from "./wishlistHelpers";

const BASE_URL = import.meta.env.VITE_API_URL;
const initialState = { ids: getGuestWishlist(), loading: false };

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const prevUserRef = useRef(user);

  useEffect(() => {
    const wasLoggedIn = prevUserRef.current;
    prevUserRef.current = user;

    if (!user) {
      if (wasLoggedIn) {
        Promise.resolve().then(() => dispatch({ type: "RESET_GUEST" }));
      }
      return;
    }

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (!cancelled) dispatch({ type: "FETCH_START" });
        return fetch(`${BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      })
      .then((r) => r.json())
      .then((products) => {
        if (!cancelled) dispatch({ type: "FETCH_DONE", ids: products.map((p) => p._id) });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "FETCH_ERROR" });
      });

    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!user) localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.ids));
  }, [state.ids, user]);

  const isWishlisted = useCallback(
    (productId) => state.ids.includes(productId),
    [state.ids]
  );

  const toggleWishlist = useCallback(async (productId) => {
    dispatch({ type: "TOGGLE", id: productId });

    if (!user) return;

    try {
      const alreadySaved = state.ids.includes(productId);
      await fetch(`${BASE_URL}/api/wishlist/${productId}`, {
        method: alreadySaved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch {
      dispatch({ type: "REVERT", id: productId });
    }
  }, [state.ids, user]);

  return (
    <WishlistContext.Provider value={{
      wishlist: state.ids,
      loading: state.loading,
      isWishlisted,
      toggleWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}