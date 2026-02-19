import React from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";

// Import your Bag images
import bag1 from "../assets/My_Collections/Bags/Bag (1).jpg";
import bag2 from "../assets/My_Collections/Bags/Bag (2).jpg";
import bag3 from "../assets/My_Collections/Bags/Bag (3).jpg";
import bag4 from "../assets/My_Collections/Bags/Bag (4).jpg";
import bag5 from "../assets/My_Collections/Bags/Bag (5).jpg";
import bag6 from "../assets/My_Collections/Bags/Bag (6).jpg";
import bag7 from "../assets/My_Collections/Bags/Bag (7).jpg";
import bag8 from "../assets/My_Collections/Bags/Bag (8).jpg";
import bag9 from "../assets/My_Collections/Bags/Bag (9).jpg";
import bag10 from "../assets/My_Collections/Bags/Bag (10).jpg";

const Bags = () => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const products = [
    { id: "bag-001", name: "Premium Bag", price: 15000, image: bag1 },
    { id: "bag-002", name: "Premium Bag", price: 15000, image: bag2 },
    { id: "bag-003", name: "Premium Bag", price: 15000, image: bag3 },
    { id: "bag-004", name: "Premium Bag", price: 15000, image: bag4 },
    { id: "bag-005", name: "Premium Bag", price: 15000, image: bag5 },
    { id: "bag-006", name: "Premium Bag", price: 15000, image: bag6 },
    { id: "bag-007", name: "Premium Bag", price: 15000, image: bag7 },
    { id: "bag-008", name: "Premium Bag", price: 15000, image: bag8 },
    { id: "bag-011", name: "Premium Bag", price: 15555, image: bag9 },
    { id: "bag-012", name: "Premium Bag", price: 16666, image: bag10},
  ];

  return (
    <>
      <Navbar />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Bags</h2>
          <p>Luxury Men's bag</p>
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
      <Footer />
    </>
  );
};

export default Bags;
