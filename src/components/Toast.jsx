import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const Toast = () => {
  const { toast } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;

    let frame = requestAnimationFrame(() => setVisible(true));
    let timer = setTimeout(() => setVisible(false), 1800);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
