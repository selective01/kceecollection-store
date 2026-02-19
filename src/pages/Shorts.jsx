import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import jeanshorts1 from "../assets/My_Collections/JeanShorts/JeanShort (1).jpg";
import jeanshorts2 from "../assets/My_Collections/JeanShorts/JeanShort (2).jpg";
import jeanshorts3 from "../assets/My_Collections/JeanShorts/JeanShort (3).jpg";
import jeanshorts4 from "../assets/My_Collections/JeanShorts/JeanShort (4).jpg";
import jeanshorts5 from "../assets/My_Collections/JeanShorts/JeanShort (5).jpg";
import jeanshorts6 from "../assets/My_Collections/JeanShorts/JeanShort (6).jpg";
import jeanshorts7 from "../assets/My_Collections/JeanShorts/JeanShort (7).jpg";
import jeanshorts8 from "../assets/My_Collections/JeanShorts/JeanShort (8).jpg";
import jeanshorts9 from "../assets/My_Collections/JeanShorts/JeanShort (9).jpg";
import jeanshorts10 from "../assets/My_Collections/JeanShorts/JeanShort (10).jpg";

const Shorts = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = [32, 33, 34, 36, 38, 40];

  const products = [
    { id: "jeanshorts-001", name: "Street Shorts", price: 12000, image: jeanshorts1 },
    { id: "jeanshorts-002", name: "Street Shorts", price: 12000, image: jeanshorts2 },
    { id: "jeanshorts-003", name: "Street Shorts", price: 12000, image: jeanshorts3 },
    { id: "jeanshorts-004", name: "Street Shorts", price: 12000, image: jeanshorts4 },
    { id: "jeanshorts-005", name: "Street Shorts", price: 12555, image: jeanshorts5 },
    { id: "jeanshorts-006", name: "Street Shorts", price: 12555, image: jeanshorts6 },
    { id: "jeanshorts-007", name: "Street Shorts", price: 12555, image: jeanshorts7 },
    { id: "jeanshorts-008", name: "Street Shorts", price: 12555, image: jeanshorts8 },
    { id: "jeanshorts-011", name: "Street Shorts", price: 12555, image: jeanshorts9 },
    { id: "jeanshorts-012", name: "Street Shorts", price: 13333, image: jeanshorts10 },
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
          <h2>Jean Shorts</h2>
          <p>Premium streetwear shorts</p>
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
      <Footer />
    </>
  );
};

export default Shorts;
