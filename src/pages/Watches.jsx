import React from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";


import watch1 from "../assets/My_Collections/Watches/Watch (1).jpg";
import watch2 from "../assets/My_Collections/Watches/Watch (2).jpg";
import watch3 from "../assets/My_Collections/Watches/Watch (3).jpg";
import watch4 from "../assets/My_Collections/Watches/Watch (4).jpg";
import watch5 from "../assets/My_Collections/Watches/Watch (5).jpg";
import watch6 from "../assets/My_Collections/Watches/Watch (6).jpg";
import watch7 from "../assets/My_Collections/Watches/Watch (7).jpg";
import watch8 from "../assets/My_Collections/Watches/Watch (8).jpg";
import watch9 from "../assets/My_Collections/Watches/Watch (9).jpg";
import watch10 from "../assets/My_Collections/Watches/Watch (10).jpg";

const Watches = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const products = [
    { id: "watch-001", name: "Watch", price: 6000, image: watch1 },
    { id: "watch-002", name: "Watch", price: 6000, image: watch2 },
    { id: "watch-003", name: "Watch", price: 6000, image: watch3 },
    { id: "watch-004", name: "Watch", price: 6000, image: watch4 },
    { id: "watch-005", name: "Watch", price: 6000, image: watch5 },
    { id: "watch-006", name: "Watch", price: 6000, image: watch6 },
    { id: "watch-007", name: "Watch", price: 6000, image: watch7 },
    { id: "watch-008", name: "Watch", price: 6000, image: watch8 },
    { id: "watch-009", name: "Watch", price: 6000, image: watch9 },
    { id: "watch-010", name: "Watch", price: 6000, image: watch10 },
  ];

  return (
    <>
      <Navbar />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Watches</h2>
          <p>Latest premium watches</p>
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

export default Watches;
