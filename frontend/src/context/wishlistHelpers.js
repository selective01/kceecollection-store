export const WISHLIST_KEY = "kcee_wishlist";

export function getGuestWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function wishlistReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_DONE":
      return { ids: action.ids, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "RESET_GUEST":
      return { ids: getGuestWishlist(), loading: false };
    case "TOGGLE": {
      const has = state.ids.includes(action.id);
      return { ...state, ids: has ? state.ids.filter((x) => x !== action.id) : [...state.ids, action.id] };
    }
    case "REVERT": {
      const has = state.ids.includes(action.id);
      return { ...state, ids: has ? state.ids.filter((x) => x !== action.id) : [...state.ids, action.id] };
    }
    default:
      return state;
  }
}