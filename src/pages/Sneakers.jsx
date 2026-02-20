import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import sneakers1 from "../assets/My_Collections/Sneakers/Sneakers (1).jpg";
import sneakers2 from "../assets/My_Collections/Sneakers/Sneakers (2).jpg";
import sneakers3 from "../assets/My_Collections/Sneakers/Sneakers (3).jpg";
import sneakers4 from "../assets/My_Collections/Sneakers/Sneakers (4).jpg";
import sneakers5 from "../assets/My_Collections/Sneakers/Sneakers (5).jpg";
import sneakers6 from "../assets/My_Collections/Sneakers/Sneakers (6).jpg";
import sneakers7 from "../assets/My_Collections/Sneakers/Sneakers (7).jpg";
import sneakers8 from "../assets/My_Collections/Sneakers/Sneakers (8).jpg";
import sneakers9 from "../assets/My_Collections/Sneakers/Sneakers (9).jpg";
import sneakers10 from "../assets/My_Collections/Sneakers/Sneakers (10).jpg";

const Sneakers = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = [40, 41, 42, 43, 44, 45];

  const products = [
    { id: "sneakers-001", name: "Premium Sneakers", price: 12000, image: sneakers1 },
    { id: "sneakers-002", name: "Premium Sneakers", price: 12000, image: sneakers2 },
    { id: "sneakers-003", name: "Premium Sneakers", price: 12555, image: sneakers3 },
    { id: "sneakers-004", name: "Premium Sneakers", price: 12555, image: sneakers4 },
    { id: "sneakers-005", name: "Premium Sneakers", price: 13333, image: sneakers5 },
    { id: "sneakers-006", name: "Premium Sneakers", price: 13333, image: sneakers6 },
    { id: "sneakers-007", name: "Premium Sneakers", price: 14444, image: sneakers7 },
    { id: "sneakers-008", name: "Premium Sneakers", price: 14444, image: sneakers8 },
    { id: "sneakers-009", name: "Premium Sneakers", price: 15555, image: sneakers9 },
    { id: "sneakers-010", name: "Premium Sneakers", price: 15555, image: sneakers10 },
  ];

  const handleSizeSelect = (productId, size) => setSelectedSizes({ ...selectedSizes, [productId]: size });
  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) { alert("Please select a sneakers size"); return; }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <>
      
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Sneakers</h2>
          <p>Premium streetwear sneakers</p>
        </div>
        <div className="categories-grid">
          {products.map((product) => (
            <div key={product.id} className="category-card product-card">
              <div className="image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
              </div>

              <div className="card-info">
                <h3>{product.name}</h3>
                <p className="price">₦{product.price.toLocaleString()}</p>

                {/* Shoe Size Selector */}
                <div className="size-selector">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className={`size-option-shoe ${
                        selectedSizes[product.id] === size ? "active" : ""
                      }`}
                      onClick={() => handleSizeSelect(product.id, size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>

                {isLoggedIn ? (
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <p className="login-warning">
                    Please{" "}
                    <strong>
                      <Link to="/auth" state={{ from: location }}>
                        login
                      </Link>
                    </strong>{" "}
                    to add to cart
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

export default Sneakers;
