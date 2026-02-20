import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import jeans1 from "../assets/My_Collections/Jeans/Jean (1).jpg";
import jeans2 from "../assets/My_Collections/Jeans/Jean (2).jpg";
import jeans3 from "../assets/My_Collections/Jeans/Jean (3).jpg";
import jeans4 from "../assets/My_Collections/Jeans/Jean (4).jpg";
import jeans5 from "../assets/My_Collections/Jeans/Jean (5).jpg";
import jeans6 from "../assets/My_Collections/Jeans/Jean (6).jpg";
import jeans7 from "../assets/My_Collections/Jeans/Jean (7).jpg";
import jeans8 from "../assets/My_Collections/Jeans/Jean (8).jpg";
import jeans9 from "../assets/My_Collections/Jeans/Jean (9).jpg";
import jeans10 from "../assets/My_Collections/Jeans/Jean (10).jpg";

const Jeans = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = [32, 33, 34, 36, 38, 40];

  const products = [
    { id: "jeans-001", name: "Premium Jeans", price: 20000, image: jeans1 },
    { id: "jeans-002", name: "Premium Jeans", price: 20000, image: jeans2 },
    { id: "jeans-003", name: "Premium Jeans", price: 21000, image: jeans3 },
    { id: "jeans-004", name: "Premium Jeans", price: 21555, image: jeans4 },
    { id: "jeans-005", name: "Premium Jeans", price: 22222, image: jeans5 },
    { id: "jeans-006", name: "Premium Jeans", price: 23333, image: jeans6 },
    { id: "jeans-007", name: "Premium Jeans", price: 24444, image: jeans7 },
    { id: "jeans-008", name: "Premium Jeans", price: 25555, image: jeans8 },
    { id: "jeans-011", name: "Premium Jeans", price: 26666, image: jeans9 },
    { id: "jeans-012", name: "Premium Jeans", price: 27777, image: jeans10},
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
          <h2>Jeans</h2>
          <p>luxury streetwear jeans</p>
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

export default Jeans;
