// orderUtils.js — shared helpers for order pages

export const generateOrderId = () =>
  "#" + Math.floor(700000 + Math.random() * 99999);
