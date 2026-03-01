import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Breadcrumb from "./components/Breadcrumb";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
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
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Userdashboard from "./pages/user/Userdashboard.jsx";
import MyOrders from "./pages/user/MyOrders.jsx";
import ProfileSettings from "./pages/user/ProfileSettings.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import OrdersPage from "./pages/admin/OrdersPage.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";

import ProtectedAdmin from "./components/ProtectedAdmin";

import "./assets/css/style.css";

// Pages where breadcrumb should appear (public only)
const breadcrumbPages = [
  "/bags", "/caps", "/cart", "/club-jersey", "/designer-shirts",
  "/hoodies", "/jeans", "/jean-shorts", "/joggers", "/perfume",
  "/checkout", "/polo", "/retro-jersey", "/shoes", "/shorts",
  "/sleeveless", "/slippers", "/sneakers", "/t-shirts", "/watches",
];

// Public Layout: Navbar + optional Breadcrumb + Footer
function PublicLayout({ children }) {
  const location = useLocation();
  const showBreadcrumb = breadcrumbPages.includes(location.pathname);

  return (
    <>
      <Navbar />
      {showBreadcrumb && <Breadcrumb />}
      <main className="page-content">{children}</main>
      <Footer />
    </>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="*" element={<div>404 - Admin page not found</div>} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <CartProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/bags" element={<PublicLayout><Bags /></PublicLayout>} />
        <Route path="/caps" element={<PublicLayout><Caps /></PublicLayout>} />
        <Route path="/club-jersey" element={<PublicLayout><ClubJersey /></PublicLayout>} />
        <Route path="/designer-shirts" element={<PublicLayout><DesignerShirts /></PublicLayout>} />
        <Route path="/hoodies" element={<PublicLayout><Hoodies /></PublicLayout>} />
        <Route path="/jeans" element={<PublicLayout><Jeans /></PublicLayout>} />
        <Route path="/jean-shorts" element={<PublicLayout><JeanShorts /></PublicLayout>} />
        <Route path="/joggers" element={<PublicLayout><Joggers /></PublicLayout>} />
        <Route path="/perfume" element={<PublicLayout><Perfume /></PublicLayout>} />
        <Route path="/polo" element={<PublicLayout><Polo /></PublicLayout>} />
        <Route path="/retro-jersey" element={<PublicLayout><RetroJersey /></PublicLayout>} />
        <Route path="/shoes" element={<PublicLayout><Shoes /></PublicLayout>} />
        <Route path="/shorts" element={<PublicLayout><Shorts /></PublicLayout>} />
        <Route path="/sleeveless" element={<PublicLayout><Sleeveless /></PublicLayout>} />
        <Route path="/slippers" element={<PublicLayout><Slippers /></PublicLayout>} />
        <Route path="/sneakers" element={<PublicLayout><Sneakers /></PublicLayout>} />
        <Route path="/t-shirts" element={<PublicLayout><TShirts /></PublicLayout>} />
        <Route path="/watches" element={<PublicLayout><Watches /></PublicLayout>} />
        <Route path="/payment-success" element={<PublicLayout><PaymentSuccess /></PublicLayout>} />
        <Route path="/order-success" element={<PublicLayout><OrderSuccess /></PublicLayout>} />
        <Route path="/dashboard" element={<Userdashboard />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/profile" element={<ProfileSettings />} />

        {/* All admin routes under /admin/* */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </CartProvider>
  );
}

export default App;