import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import clubjersey1 from "../assets/My_Collections/ClubJersey/ClubJersey (1).jpg";
import clubjersey2 from "../assets/My_Collections/ClubJersey/ClubJersey (2).jpg";
import clubjersey3 from "../assets/My_Collections/ClubJersey/ClubJersey (3).jpg";
import clubjersey4 from "../assets/My_Collections/ClubJersey/ClubJersey (4).jpg";
import clubjersey5 from "../assets/My_Collections/ClubJersey/ClubJersey (5).jpg";
import clubjersey6 from "../assets/My_Collections/ClubJersey/ClubJersey (6).jpg";
import clubjersey7 from "../assets/My_Collections/ClubJersey/ClubJersey (7).jpg";
import clubjersey8 from "../assets/My_Collections/ClubJersey/ClubJersey (8).jpg";
import clubjersey9 from "../assets/My_Collections/ClubJersey/ClubJersey (9).jpg";
import clubjersey10 from "../assets/My_Collections/ClubJersey/ClubJersey (10).jpg";

const ClubJersey = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "clubjersey-001", name: "Club Jersey", price: 25000, image: clubjersey1 },
    { id: "clubjersey-002", name: "Club Jersey", price: 25000, image: clubjersey2 },
    { id: "clubjersey-003", name: "Club Jersey", price: 25000, image: clubjersey3 },
    { id: "clubjersey-004", name: "Club Jersey", price: 25000, image: clubjersey4 },
    { id: "clubjersey-005", name: "Club Jersey", price: 25000, image: clubjersey5 },
    { id: "clubjersey-006", name: "Club Jersey", price: 25000, image: clubjersey6 },
    { id: "clubjersey-007", name: "Club Jersey", price: 25000, image: clubjersey7 },
    { id: "clubjersey-008", name: "Club Jersey", price: 25000, image: clubjersey8 },
    { id: "clubjersey-019", name: "Club Jersey", price: 25000, image: clubjersey9 },
    { id: "clubjersey-111", name: "Club Jersey", price: 25555, image: clubjersey10 },
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
          <h2>Club Jerseys</h2>
          <p>Premium club jerseys collection</p>
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

export default ClubJersey;
