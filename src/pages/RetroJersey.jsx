import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import retrojersey1 from "../assets/My_Collections/RetroJersey/RetroJersey (1).jpg";
import retrojersey2 from "../assets/My_Collections/RetroJersey/RetroJersey (2).jpg";
import retrojersey3 from "../assets/My_Collections/RetroJersey/RetroJersey (3).jpg";
import retrojersey4 from "../assets/My_Collections/RetroJersey/RetroJersey (4).jpg";
import retrojersey5 from "../assets/My_Collections/RetroJersey/RetroJersey (5).jpg";
import retrojersey6 from "../assets/My_Collections/RetroJersey/RetroJersey (6).jpg";
import retrojersey7 from "../assets/My_Collections/RetroJersey/RetroJersey (7).jpg";
import retrojersey8 from "../assets/My_Collections/RetroJersey/RetroJersey (8).jpg";
import retrojersey9 from "../assets/My_Collections/RetroJersey/RetroJersey (9).jpg";
import retrojersey10 from "../assets/My_Collections/RetroJersey/RetroJersey (10).jpg";

const RetroJersey = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "retrojersey-001", name: "Retro Jersey", price: 25000, image: retrojersey1 },
    { id: "retrojersey-002", name: "Retro Jersey", price: 25000, image: retrojersey2 },
    { id: "retrojersey-003", name: "Retro Jersey", price: 25000, image: retrojersey3 },
    { id: "retrojersey-004", name: "Retro Jersey", price: 25000, image: retrojersey4 },
    { id: "retrojersey-005", name: "Retro Jersey", price: 25555, image: retrojersey5 },
    { id: "retrojersey-006", name: "Retro Jersey", price: 25555, image: retrojersey6 },
    { id: "retrojersey-007", name: "Retro Jersey", price: 25555, image: retrojersey7 },
    { id: "retrojersey-008", name: "Retro Jersey", price: 25555, image: retrojersey8 },
    { id: "retrojersey-011", name: "Retro Jersey", price: 27777, image: retrojersey9 },
    { id: "retrojersey-012", name: "Retro Jersey", price: 27777, image: retrojersey10 },
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
        <div className="section-header"><h2>Retro Jersey</h2><p>Premium retro jerseys</p></div>
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

export default RetroJersey;
