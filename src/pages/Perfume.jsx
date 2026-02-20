import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import perfume1 from "../assets/My_Collections/Perfume/Perfume (1).jpg";
import perfume2 from "../assets/My_Collections/Perfume/Perfume (2).jpg";
import perfume3 from "../assets/My_Collections/Perfume/Perfume (3).jpg";
import perfume4 from "../assets/My_Collections/Perfume/Perfume (4).jpg";
import perfume5 from "../assets/My_Collections/Perfume/Perfume (5).jpg";
import perfume6 from "../assets/My_Collections/Perfume/Perfume (6).jpg";
import perfume7 from "../assets/My_Collections/Perfume/Perfume (7).jpg";
import perfume8 from "../assets/My_Collections/Perfume/Perfume (8).jpg";
import perfume9 from "../assets/My_Collections/Perfume/Perfume (9).jpg";
import perfume10 from "../assets/My_Collections/Perfume/Perfume (10).jpg";

const Perfume = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["50ml", "100ml", "200ml"];

  const products = [
    { id: "perfume-001", name: "Luxury Perfume", price: 15000, image: perfume1 },
    { id: "perfume-002", name: "Luxury Perfume", price: 15000, image: perfume2 },
    { id: "perfume-003", name: "Luxury Perfume", price: 15000, image: perfume3 },
    { id: "perfume-004", name: "Luxury Perfume", price: 15000, image: perfume4 },
    { id: "perfume-005", name: "Luxury Perfume", price: 15000, image: perfume5 },
    { id: "perfume-006", name: "Luxury Perfume", price: 15000, image: perfume6 },
    { id: "perfume-007", name: "Luxury Perfume", price: 15000, image: perfume7 },
    { id: "perfume-008", name: "Luxury Perfume", price: 15000, image: perfume8 },
    { id: "perfume-009", name: "Luxury Perfume", price: 15000, image: perfume9 },
    { id: "perfume-010", name: "Luxury Perfume", price: 15000, image: perfume10 },
  ];

  const handleSizeSelect = (productId, size) => setSelectedSizes({ ...selectedSizes, [productId]: size });
  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) { alert("Please select a size"); return; }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <>
      
      
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Perfume</h2>
          <p>Premium fragrance collection</p>
        </div>
        <div className="categories-grid">
          {products.map((product) => (
            <div key={product.id} className="category-card product-card">
              <div className="image-wrapper">
                <img src={product.image} alt={product.name} className="product-img" />
              </div>
              <div className="card-info">
                <h3>{product.name}</h3>
                <p className="price">₦{product.price.toLocaleString()}</p>
                <div className="size-selector">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className={`size-option ${selectedSizes[product.id] === size ? "active" : ""}`}
                      onClick={() => handleSizeSelect(product.id, size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
                {isLoggedIn ? (
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                ) : (
                  <p className="login-warning">
                    Please <strong><Link to="/auth" state={{ from: location }}>login</Link></strong> to add to cart
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </>
  );
};

export default Perfume;
