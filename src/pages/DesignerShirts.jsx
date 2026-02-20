import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import designershirts1 from "../assets/My_Collections/DesignerShirts/DesignerShirt (1).jpg";
import designershirts2 from "../assets/My_Collections/DesignerShirts/DesignerShirt (2).jpg";
import designershirts3 from "../assets/My_Collections/DesignerShirts/DesignerShirt (3).jpg";
import designershirts4 from "../assets/My_Collections/DesignerShirts/DesignerShirt (4).jpg";
import designershirts5 from "../assets/My_Collections/DesignerShirts/DesignerShirt (5).jpg";
import designershirts6 from "../assets/My_Collections/DesignerShirts/DesignerShirt (6).jpg";
import designershirts7 from "../assets/My_Collections/DesignerShirts/DesignerShirt (7).jpg";
import designershirts8 from "../assets/My_Collections/DesignerShirts/DesignerShirt (8).jpg";
import designershirts9 from "../assets/My_Collections/DesignerShirts/DesignerShirt (9).jpg";
import designershirts10 from "../assets/My_Collections/DesignerShirts/DesignerShirt (10).jpg";

const DesignerShirts = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sizes = ["S", "M", "L", "XL"];

  const products = [
    { id: "DesignerShirt-001", name: "Designer Shirt", price: 20000, image: designershirts1 },
    { id: "DesignerShirt-002", name: "Designer Shirt", price: 20000, image: designershirts2 },
    { id: "DesignerShirt-003", name: "Designer Shirt", price: 20000, image: designershirts3 },
    { id: "DesignerShirt-004", name: "Designer Shirt", price: 20000, image: designershirts4 },
    { id: "DesignerShirt-005", name: "Designer Shirt", price: 25555, image: designershirts5 },
    { id: "DesignerShirt-006", name: "Designer Shirt", price: 25555, image: designershirts6 },
    { id: "DesignerShirt-007", name: "Designer Shirt", price: 25555, image: designershirts7 },
    { id: "DesignerShirt-008", name: "Designer Shirt", price: 25555, image: designershirts8 },
    { id: "DesignerShirt-011", name: "Designer Shirt", price: 25555, image: designershirts9 },
    { id: "DesignerShirt-012", name: "Designer Shirt", price: 27777, image: designershirts10 },
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
          <h2>Designer Shirts</h2>
          <p>Premium streetwear shirts</p>
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

export default DesignerShirts;
