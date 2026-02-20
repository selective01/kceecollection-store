import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import polo1 from "../assets/My_Collections/Polo/Polo (1).jpg";
import polo2 from "../assets/My_Collections/Polo/Polo (2).jpg";
import polo3 from "../assets/My_Collections/Polo/Polo (3).jpg";
import polo4 from "../assets/My_Collections/Polo/Polo (4).jpg";
import polo5 from "../assets/My_Collections/Polo/Polo (5).jpg";
import polo6 from "../assets/My_Collections/Polo/Polo (6).jpg";
import polo7 from "../assets/My_Collections/Polo/Polo (7).jpg";
import polo8 from "../assets/My_Collections/Polo/Polo (8).jpg";
import polo9 from "../assets/My_Collections/Polo/Polo (9).jpg";
import polo10 from "../assets/My_Collections/Polo/Polo (10).jpg";

const Polo = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "polo-001", name: "Premium Polo", price: 22000, image: polo1 },
    { id: "polo-002", name: "Premium Polo", price: 22000, image: polo2 },
    { id: "polo-003", name: "Premium Polo", price: 22000, image: polo3 },
    { id: "polo-004", name: "Premium Polo", price: 22000, image: polo4 },
    { id: "polo-005", name: "Premium Polo", price: 22000, image: polo5 },
    { id: "polo-006", name: "Premium Polo", price: 22000, image: polo6 },
    { id: "polo-007", name: "Premium Polo", price: 22000, image: polo7 },
    { id: "polo-008", name: "Premium Polo", price: 22000, image: polo8 },
    { id: "polo-009", name: "Premium Polo", price: 22000, image: polo9 },
    { id: "polo-010", name: "Premium Polo", price: 22000, image: polo10 },
  ];

  const handleSizeSelect = (productId, size) => setSelectedSizes({ ...selectedSizes, [productId]: size });
  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) { alert("Please select a size"); return; }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <>
      <Navbar />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Polo</h2>
          <p>Premium polo</p></div>
        <div className="categories-grid">{products.map((product) => (
          <div key={product.id} className="category-card product-card">
            <div className="image-wrapper"><img src={product.image} alt={product.name} className="product-img" /></div>
            <div className="card-info">
              <h3>{product.name}</h3>
              <p className="price">₦{product.price.toLocaleString()}</p>
              <div className="size-selector">{sizes.map((size) => (<span key={size} className={`size-option ${selectedSizes[product.id] === size ? "active" : ""}`} onClick={() => handleSizeSelect(product.id, size)}>{size}</span>))}</div>
              {isLoggedIn ? (<button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>) : (<p className="login-warning">Please <strong><Link to="/auth" state={{ from: location }}>login</Link></strong> to add to cart</p>)}
            </div>
          </div>
        ))}</div>
      </section>
      
    </>
  );
};

export default Polo;
