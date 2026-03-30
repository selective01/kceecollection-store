// cartApi.js — pure async helpers, no React imports

const BASE_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

export const fetchCartFromDB = async () => {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    return [];
  }
};

export const saveCartToDB = async (items) => {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
};

export const clearCartInDB = async () => {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/api/cart`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Failed to clear cart in DB:", err);
  }
};
