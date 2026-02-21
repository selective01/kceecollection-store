import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import shorts1 from "../assets/My_Collections/Shorts/Short (1).jpg";
import shorts2 from "../assets/My_Collections/Shorts/Short (2).jpg";
import shorts3 from "../assets/My_Collections/Shorts/Short (3).jpg";
import shorts4 from "../assets/My_Collections/Shorts/Short (4).jpg";
import shorts5 from "../assets/My_Collections/Shorts/Short (5).jpg";
import shorts6 from "../assets/My_Collections/Shorts/Short (6).jpg";
import shorts7 from "../assets/My_Collections/Shorts/Short (7).jpg";
import shorts8 from "../assets/My_Collections/Shorts/Short (8).jpg";
import shorts9 from "../assets/My_Collections/Shorts/Short (9).jpg";
import shorts10 from "../assets/My_Collections/Shorts/Short (10).jpg";

const Shorts = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "shorts-001", name: "Street Shorts", price: 12000, image: shorts1 },
    { id: "shorts-002", name: "Street Shorts", price: 12000, image: shorts2 },
    { id: "shorts-003", name: "Street Shorts", price: 12000, image: shorts3 },
    { id: "shorts-004", name: "Street Shorts", price: 12000, image: shorts4 },
    { id: "shorts-005", name: "Street Shorts", price: 12555, image: shorts5 },
    { id: "shorts-006", name: "Street Shorts", price: 12555, image: shorts6 },
    { id: "shorts-007", name: "Street Shorts", price: 12555, image: shorts7 },
    { id: "shorts-008", name: "Street Shorts", price: 12555, image: shorts8 },
    { id: "shorts-009", name: "Street Shorts", price: 12555, image: shorts9 },
    { id: "shorts-010", name: "Street Shorts", price: 13333, image: shorts10 },
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
          <h2>Shorts</h2>
          <p>Luxury streetwear shorts</p>
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
                <p className="price">
                  ₦{product.price.toLocaleString()}
                </p>

                {/* Size Selector */}
                <div className="size-selector">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className={`size-option ${
                        selectedSizes[product.id] === size ? "active" : ""
                      }`}
                      onClick={() =>
                        handleSizeSelect(product.id, size)
                      }
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

export default Shorts;
