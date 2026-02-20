import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import slippers1 from "../assets/My_Collections/Slippers/Slippers (1).jpg";
import slippers2 from "../assets/My_Collections/Slippers/Slippers (2).jpg";
import slippers3 from "../assets/My_Collections/Slippers/Slippers (3).jpg";
import slippers4 from "../assets/My_Collections/Slippers/Slippers (4).jpg";
import slippers5 from "../assets/My_Collections/Slippers/Slippers (5).jpg";
import slippers6 from "../assets/My_Collections/Slippers/Slippers (6).jpg";
import slippers7 from "../assets/My_Collections/Slippers/Slippers (7).jpg";
import slippers8 from "../assets/My_Collections/Slippers/Slippers (8).jpg";
import slippers9 from "../assets/My_Collections/Slippers/Slippers (9).jpg";
import slippers10 from "../assets/My_Collections/Slippers/Slippers (10).jpg";

const Slippers = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = [40, 41, 42, 43, 44, 45];

  const products = [
    { id: "slippers-001", name: "Premium Slippers", price: 12000, image: slippers1 },
    { id: "slippers-002", name: "Premium Slippers", price: 12000, image: slippers2 },
    { id: "slippers-003", name: "Premium Slippers", price: 12555, image: slippers3 },
    { id: "slippers-004", name: "Premium Slippers", price: 12555, image: slippers4 },
    { id: "slippers-005", name: "Premium Slippers", price: 13333, image: slippers5 },
    { id: "slippers-006", name: "Premium Slippers", price: 13333, image: slippers6 },
    { id: "slippers-007", name: "Premium Slippers", price: 14444, image: slippers7 },
    { id: "slippers-008", name: "Premium Slippers", price: 14444, image: slippers8 },
    { id: "slippers-009", name: "Premium Slippers", price: 15555, image: slippers9 },
    { id: "slippers-010", name: "Premium Slippers", price: 15555, image: slippers10 },
  ];

  const handleSizeSelect = (productId, size) => setSelectedSizes({ ...selectedSizes, [productId]: size });
  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) { alert("Please select a slippers size"); return; }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <>
      <Navbar />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Slippers</h2>
          <p>Premium streetwear slippers</p>
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

export default Slippers;
