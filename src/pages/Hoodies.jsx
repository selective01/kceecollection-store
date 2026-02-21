import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import hoodie1 from "../assets/My_Collections/Hoodie/Hoodie (1).jpg";
import hoodie2 from "../assets/My_Collections/Hoodie/Hoodie (2).jpg";
import hoodie3 from "../assets/My_Collections/Hoodie/Hoodie (3).jpg";
import hoodie4 from "../assets/My_Collections/Hoodie/Hoodie (4).jpg";
import hoodie5 from "../assets/My_Collections/Hoodie/Hoodie (5).jpg";
import hoodie6 from "../assets/My_Collections/Hoodie/Hoodie (6).jpg";
import hoodie7 from "../assets/My_Collections/Hoodie/Hoodie (7).jpg";
import hoodie8 from "../assets/My_Collections/Hoodie/Hoodie (8).jpg";
import hoodie9 from "../assets/My_Collections/Hoodie/Hoodie (9).jpg";
import hoodie10 from "../assets/My_Collections/Hoodie/Hoodie (10).jpg";


const Hoodies = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const [selectedSizes, setSelectedSizes] = useState({});

  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "hoodie-001", name: "Urban Hoodie", price: 25000, image: hoodie1 },
    { id: "hoodie-002", name: "Urban Hoodie", price: 25000, image: hoodie2 },
    { id: "hoodie-003", name: "Urban Hoodie", price: 25000, image: hoodie3 },
    { id: "hoodie-004", name: "Urban Hoodie", price: 25000, image: hoodie4 },
    { id: "hoodie-005", name: "Urban Hoodie", price: 25000, image: hoodie5 },
    { id: "hoodie-006", name: "Urban Hoodie", price: 25000, image: hoodie6 },
    { id: "hoodie-007", name: "Urban Hoodie", price: 25000, image: hoodie7 },
    { id: "hoodie-008", name: "Urban Hoodie", price: 25000, image: hoodie8 },
    { id: "hoodie-009", name: "Urban Hoodie", price: 25000, image: hoodie9 },
    { id: "hoodie-010", name: "Urban Hoodie", price: 25000, image: hoodie10 },
  ];

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size,
    });
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart({ ...product, size: selectedSize });
  };

  return (
    <>

      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Hoodies</h2>
          <p>Premium streetwear hoodies</p>
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

export default Hoodies;
