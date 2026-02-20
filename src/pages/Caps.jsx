import React from "react";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

import cap1 from "../assets/My_Collections/Caps/Cap (1).jpg";
import cap2 from "../assets/My_Collections/Caps/Cap (2).jpg";
import cap3 from "../assets/My_Collections/Caps/Cap (3).jpg";
import cap4 from "../assets/My_Collections/Caps/Cap (4).jpg";
import cap5 from "../assets/My_Collections/Caps/Cap (5).jpg";
import cap6 from "../assets/My_Collections/Caps/Cap (6).jpg";
import cap7 from "../assets/My_Collections/Caps/Cap (7).jpg";
import cap8 from "../assets/My_Collections/Caps/Cap (8).jpg";
import cap9 from "../assets/My_Collections/Caps/Cap (9).jpg";
import cap10 from "../assets/My_Collections/Caps/Cap (10).jpg";

const Caps = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const products = [
    { id: "cap-001", name: "Premium Cap", price: 8000, image: cap1 },
    { id: "cap-002", name: "Premium Cap", price: 8000, image: cap2 },
    { id: "cap-003", name: "Premium Cap", price: 8000, image: cap3 },
    { id: "cap-004", name: "Premium Cap", price: 8000, image: cap4 },
    { id: "cap-005", name: "Premium Cap", price: 8000, image: cap5 },
    { id: "cap-006", name: "Premium Cap", price: 8000, image: cap6 },
    { id: "cap-007", name: "Premium Cap", price: 8000, image: cap7 },
    { id: "cap-008", name: "Premium Cap", price: 8000, image: cap8 },
    { id: "cap-009", name: "Premium Cap", price: 8000, image: cap9 },
    { id: "cap-010", name: "Premium Cap", price: 8000, image: cap10 },
  ];


  return (
    <>

      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Caps</h2>
          <p>Premium streetwear caps</p>
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

                {isLoggedIn ? (
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
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

export default Caps;
