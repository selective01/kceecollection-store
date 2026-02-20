import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import shoes1 from "../assets/My_Collections/Shoes/Shoe (1).jpg";
import shoes2 from "../assets/My_Collections/Shoes/Shoe (2).jpg";
import shoes3 from "../assets/My_Collections/Shoes/Shoe (3).jpg";
import shoes4 from "../assets/My_Collections/Shoes/Shoe (4).jpg";
import shoes5 from "../assets/My_Collections/Shoes/Shoe (5).jpg";   
import shoes6 from "../assets/My_Collections/Shoes/Shoe (6).jpg";
import shoes7 from "../assets/My_Collections/Shoes/Shoe (7).jpg";
import shoes8 from "../assets/My_Collections/Shoes/Shoe (8).jpg";
import shoes9 from "../assets/My_Collections/Shoes/Shoe (9).jpg";
import shoes10 from "../assets/My_Collections/Shoes/Shoe (10).jpg";

const Shoes = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // State for selected sizes
  const [selectedSizes, setSelectedSizes] = useState({});

  // Shoe sizes
  const sizes = [40, 41, 42, 43, 44, 45];

  const products = [
    { id: "shoes-001", name: "Premium Shoes", price: 12000, image: shoes1 },
    { id: "shoes-002", name: "Premium Shoes", price: 12000, image: shoes2 },
    { id: "shoes-003", name: "Premium Shoes", price: 12555, image: shoes3 },
    { id: "shoes-004", name: "Premium Shoes", price: 12555, image: shoes4 },
    { id: "shoes-005", name: "Premium Shoes", price: 13333, image: shoes5 },
    { id: "shoes-006", name: "Premium Shoes", price: 13333, image: shoes6 },
    { id: "shoes-007", name: "Premium Shoes", price: 14444, image: shoes7 },
    { id: "shoes-008", name: "Premium Shoes", price: 14444, image: shoes8 },
    { id: "shoes-009", name: "Premium Shoes", price: 15555, image: shoes9 },
    { id: "shoes-010", name: "Premium Shoes", price: 15555, image: shoes10 },
  ];

  const handleSizeSelect = (productId, size) =>
    setSelectedSizes({ ...selectedSizes, [productId]: size });

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) {
      alert("Please select a shoe size");
      return;
    }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <>
      <Navbar />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Shoes</h2>
          <p>Luxury Leather Shoes</p>
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

export default Shoes;
