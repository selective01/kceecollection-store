import React from "react";
import { useCart } from "../context/CartContext";

const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return <div className="toast show">{toastMessage}</div>;
};

export default Toast;
