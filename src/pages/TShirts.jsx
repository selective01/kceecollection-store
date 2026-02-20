import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import tshirts1 from "../assets/My_Collections/Tshirts/Tshirt (1).jpg";
import tshirts2 from "../assets/My_Collections/Tshirts/Tshirt (2).jpg";
import tshirts3 from "../assets/My_Collections/Tshirts/Tshirt (3).jpg";
import tshirts4 from "../assets/My_Collections/Tshirts/Tshirt (4).jpg";
import tshirts5 from "../assets/My_Collections/Tshirts/Tshirt (5).jpg";
import tshirts6 from "../assets/My_Collections/Tshirts/Tshirt (6).jpg";
import tshirts7 from "../assets/My_Collections/Tshirts/Tshirt (7).jpg";
import tshirts8 from "../assets/My_Collections/Tshirts/Tshirt (8).jpg";
import tshirts9 from "../assets/My_Collections/Tshirts/Tshirt (9).jpg";
import tshirts10 from "../assets/My_Collections/Tshirts/Tshirt (10).jpg";

const Tshirts = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L"]; // optional sizing for watches

  const products = [
    { id: "ts-001", name: "Luxury Tshirt", price: 45000, image: tshirts1 },
    { id: "ts-002", name: "Luxury Tshirt", price: 45000, image: tshirts2 },
    { id: "ts-003", name: "Luxury Tshirt", price: 45000, image: tshirts3 },
    { id: "ts-004", name: "Luxury Tshirt", price: 45000, image: tshirts4 },
    { id: "ts-005", name: "Luxury Tshirt", price: 45000, image: tshirts5 },
    { id: "ts-006", name: "Luxury Tshirt", price: 45000, image: tshirts6 },
    { id: "ts-007", name: "Luxury Tshirt", price: 45000, image: tshirts7 },
    { id: "ts-011", name: "Luxury Tshirt", price: 45555, image: tshirts8 },
    { id: "ts-121", name: "Luxury Tshirt", price: 45555, image: tshirts9 },
    { id: "ts-131", name: "Luxury Tshirt", price: 46666, image: tshirts10 },
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
          <h2>T-Shirts</h2>
          <p>Luxury T-shirts collection</p>
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

export default Tshirts;
