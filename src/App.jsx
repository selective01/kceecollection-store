import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Auth from "./pages/Auth.jsx";
import Bags from "./pages/Bags.jsx";
import Caps from "./pages/Caps.jsx";
import ClubJersey from "./pages/ClubJersey.jsx";
import DesignerShirts from "./pages/DesignerShirts.jsx";
import Hoodies from "./pages/Hoodies.jsx";
import Jeans from "./pages/Jeans.jsx";
import JeanShorts from "./pages/JeanShorts.jsx";
import Joggers from "./pages/Joggers.jsx";
import Perfume from "./pages/Perfume.jsx";
import Polo from "./pages/Polo.jsx";
import RetroJersey from "./pages/RetroJersey.jsx";
import Shoes from "./pages/Shoes.jsx";
import Shorts from "./pages/Shorts.jsx";
import Sleeveless from "./pages/Sleeveless.jsx";
import Slippers from "./pages/Slippers.jsx";
import Sneakers from "./pages/Sneakers.jsx";
import TShirts from "./pages/TShirts.jsx";
import Watches from "./pages/Watches.jsx";
import "./assets/css/style.css";

function AppRoutes() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/bags" element={<Bags />} />
      <Route path="/caps" element={<Caps />} />
      <Route path="/club-jersey" element={<ClubJersey />} />
      <Route path="/designer-shirts" element={<DesignerShirts />} />
      <Route path="/hoodies" element={<Hoodies />} />
      <Route path="/jeans" element={<Jeans />} />
      <Route path="/jean-shorts" element={<JeanShorts />} />
      <Route path="/joggers" element={<Joggers />} />
      <Route path="/perfume" element={<Perfume />} />
      <Route path="/polo" element={<Polo />} />
      <Route path="/retro-jersey" element={<RetroJersey />} />
      <Route path="/shoes" element={<Shoes />} />
      <Route path="/shorts" element={<Shorts />} />
      <Route path="/sleeveless" element={<Sleeveless />} />
      <Route path="/slippers" element={<Slippers />} />
      <Route path="/sneakers" element={<Sneakers />} />
      <Route path="/t-shirts" element={<TShirts />} />
      <Route path="/watches" element={<Watches />} />
    </Routes>
  );
}

function AppWrapper() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a spinner
  }

  return (
    <CartProvider currentUser={user}>
      <AppRoutes />
    </CartProvider>
  );
}

function App() {
  return <AppWrapper />;
}

export default App;

