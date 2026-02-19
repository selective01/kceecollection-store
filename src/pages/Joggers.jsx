import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import joggers1 from "../assets/My_Collections/Joggers/Joggers (1).jpg";
import joggers2 from "../assets/My_Collections/Joggers/Joggers (2).jpg";
import joggers3 from "../assets/My_Collections/Joggers/Joggers (3).jpg";
import joggers4 from "../assets/My_Collections/Joggers/Joggers (4).jpg";
import joggers5 from "../assets/My_Collections/Joggers/Joggers (5).jpg";
import joggers6 from "../assets/My_Collections/Joggers/Joggers (6).jpg";
import joggers7 from "../assets/My_Collections/Joggers/Joggers (7).jpg";
import joggers8 from "../assets/My_Collections/Joggers/Joggers (8).jpg";
import joggers9 from "../assets/My_Collections/Joggers/Joggers (9).jpg";
import joggers10 from "../assets/My_Collections/Joggers/Joggers (10).jpg";

const Joggers = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "joggers-001", name: "Premium Joggers", price: 22000, image: joggers1 },
    { id: "joggers-002", name: "Premium Joggers", price: 22000, image: joggers2 },
    { id: "joggers-003", name: "Premium Joggers", price: 22000, image: joggers3 },
    { id: "joggers-004", name: "Premium Joggers", price: 22000, image: joggers4 },
    { id: "joggers-005", name: "Premium Joggers", price: 22000, image: joggers5 },
    { id: "joggers-006", name: "Premium Joggers", price: 22555, image: joggers6 },
    { id: "joggers-007", name: "Premium Joggers", price: 22555, image: joggers7 },
    { id: "joggers-008", name: "Premium Joggers", price: 23333, image: joggers8 },
    { id: "joggers-011", name: "Premium Joggers", price: 23333, image: joggers9 },
    { id: "joggers-012", name: "Premium Joggers", price: 24444, image:joggers10},
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
          <h2>Joggers</h2>
          <p>Premium streetwear joggers</p>
        </div>
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
      <Footer />
    </>
  );
};

export default Joggers;
