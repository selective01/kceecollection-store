import React from "react";
import { Link } from "react-router-dom";
import { useHeroSearch } from "../hooks/useHeroSearch";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import crown from "../assets/Icons/crown.png";
import logout from "../assets/Icons/user1.png";
import login from "../assets/Icons/user2.png";

const Navbar = () => {
  const {
    searchWrapperRef,
    searchInputRef,
    voiceIconRef,
    searchToggleIconRef,
  } = useHeroSearch();

  const { cartCount } = useCart();
  const { isLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="nav">
      <Link to="/" className="brand">
        <h1>KceeCollection</h1>
        <img
          src={crown}       
          alt="Kceecollection Crown Icon"
          className="crown"
          style={{ width: '15px', height: '15px' }} 
        />
      </Link>

      <div className="nav-center">
        <i
          className="fa-solid fa-magnifying-glass search-toggle-icon"
          ref={searchToggleIconRef}
        >
        </i>

        <div className="search-wrapper" ref={searchWrapperRef}>
          <input
            type="text"
            className="search"
            placeholder="Search KceeCollection..."
            ref={searchInputRef}
          />
          <span
            className="voice-icon"
            ref={voiceIconRef}
            role="button"
            aria-label="Voice search"
          >
            🎙️
          </span>
        </div>
      </div>

      <nav className="menu-items">
        <a href="#shop">
          <span className="menu-icon">
            <i className="fa-solid fa-shop"></i>
          </span>
          <span className="menu-text">Shop</span>
        </a>

        <a href="#about">
          <span className="menu-icon">
            <i className="fa-regular fa-address-card"></i>
          </span>
          <span className="menu-text">About</span>
        </a>

        <a href="#contact">
          <span className="menu-icon">
            <i className="fa-solid fa-address-book"></i>
          </span>
          <span className="menu-text">Contact</span>
        </a>
        <Link to="/cart" className="cart-btn">
          <span className="menu-icon">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-badge">{cartCount}</span>
          </span>
        </Link>

        {isLoggedIn ? (
          <a href="#" onClick={handleLogout} title="Logout">
            <img src={logout} alt="Logout Icon" className="user-icon" />
            <span className="menu-text">Logout</span>
          </a>
        ) : (
          <Link to="/auth">
            <img src={login} alt="Login Icon" className="user-icon" />
            <span className="menu-text">Login</span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
