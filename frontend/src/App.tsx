import React, { Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartProvider";
import { WishlistProvider } from "./context/WishlistProvider";
import { AuthProvider }     from "./context/AuthProvider";   // ✅ added
import PageLoader           from "./components/ui/PageLoader";
import UserLayout           from "./components/UserLayout";
import PublicLayout         from "./components/PublicLayout"; // ✅ extracted
import AdminRoutes          from "./components/AdminRoutes";  // ✅ extracted
import { prefetchCategories, fetchNewArrivals } from "./utils/productCache";

// ── PUBLIC PAGES ──────────────────────────────────────────────────────────────
const Home           = React.lazy(() => import("./pages/Home"));
const Auth           = React.lazy(() => import("./pages/Auth"));
const Cart           = React.lazy(() => import("./pages/Cart"));
const Checkout       = React.lazy(() => import("./pages/Checkout"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const OrderSuccess   = React.lazy(() => import("./pages/OrderSuccess"));
const Contact        = React.lazy(() => import("./pages/Contact"));
const Search         = React.lazy(() => import("./pages/Search"));
const Wishlist       = React.lazy(() => import("./pages/Wishlist"));

// ── CATEGORY PAGES ────────────────────────────────────────────────────────────
const Bags           = React.lazy(() => import("./pages/Bags"));
const Caps           = React.lazy(() => import("./pages/Caps"));
const ClubJersey     = React.lazy(() => import("./pages/ClubJersey"));
const DesignerShirts = React.lazy(() => import("./pages/DesignerShirts"));
const Hoodies        = React.lazy(() => import("./pages/Hoodies"));
const Jeans          = React.lazy(() => import("./pages/Jeans"));
const JeanShorts     = React.lazy(() => import("./pages/JeanShorts"));
const Joggers        = React.lazy(() => import("./pages/Joggers"));
const Perfume        = React.lazy(() => import("./pages/Perfume"));
const Polo           = React.lazy(() => import("./pages/Polo"));
const RetroJersey    = React.lazy(() => import("./pages/RetroJersey"));
const Shoes          = React.lazy(() => import("./pages/Shoes"));
const Shorts         = React.lazy(() => import("./pages/Shorts"));
const Sleeveless     = React.lazy(() => import("./pages/Sleeveless"));
const Slippers       = React.lazy(() => import("./pages/Slippers"));
const Sneakers       = React.lazy(() => import("./pages/Sneakers"));
const TShirts        = React.lazy(() => import("./pages/TShirts"));
const Watches        = React.lazy(() => import("./pages/Watches"));

// ── USER PAGES ────────────────────────────────────────────────────────────────
const MyOrders        = React.lazy(() => import("./pages/user/MyOrders"));
const ProfileSettings = React.lazy(() => import("./pages/user/ProfileSettings"));

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    prefetchCategories(["TShirts", "Polo", "Hoodies", "Jeans", "Sneakers"]);
    fetchNewArrivals().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── PUBLIC ── */}
              <Route path="/"                element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/auth"            element={<PublicLayout><Auth /></PublicLayout>} />
              <Route path="/cart"            element={<PublicLayout><Cart /></PublicLayout>} />
              <Route path="/checkout"        element={<PublicLayout><Checkout /></PublicLayout>} />
              <Route path="/payment-success" element={<PublicLayout><PaymentSuccess /></PublicLayout>} />
              <Route path="/order-success"   element={<PublicLayout><OrderSuccess /></PublicLayout>} />
              <Route path="/contact"         element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/search"          element={<PublicLayout><Search /></PublicLayout>} />

              {/* ── CATEGORIES ── */}
              <Route path="/bags"            element={<PublicLayout><Bags /></PublicLayout>} />
              <Route path="/caps"            element={<PublicLayout><Caps /></PublicLayout>} />
              <Route path="/club-jersey"     element={<PublicLayout><ClubJersey /></PublicLayout>} />
              <Route path="/designer-shirts" element={<PublicLayout><DesignerShirts /></PublicLayout>} />
              <Route path="/hoodies"         element={<PublicLayout><Hoodies /></PublicLayout>} />
              <Route path="/jeans"           element={<PublicLayout><Jeans /></PublicLayout>} />
              <Route path="/jean-shorts"     element={<PublicLayout><JeanShorts /></PublicLayout>} />
              <Route path="/joggers"         element={<PublicLayout><Joggers /></PublicLayout>} />
              <Route path="/perfume"         element={<PublicLayout><Perfume /></PublicLayout>} />
              <Route path="/polo"            element={<PublicLayout><Polo /></PublicLayout>} />
              <Route path="/retro-jersey"    element={<PublicLayout><RetroJersey /></PublicLayout>} />
              <Route path="/shoes"           element={<PublicLayout><Shoes /></PublicLayout>} />
              <Route path="/shorts"          element={<PublicLayout><Shorts /></PublicLayout>} />
              <Route path="/sleeveless"      element={<PublicLayout><Sleeveless /></PublicLayout>} />
              <Route path="/slippers"        element={<PublicLayout><Slippers /></PublicLayout>} />
              <Route path="/sneakers"        element={<PublicLayout><Sneakers /></PublicLayout>} />
              <Route path="/t-shirts"        element={<PublicLayout><TShirts /></PublicLayout>} />
              <Route path="/watches"         element={<PublicLayout><Watches /></PublicLayout>} />

              {/* ── USER (auth-guarded via UserLayout) ── */}
              <Route element={<UserLayout />}>
                <Route path="/orders"   element={<MyOrders />} />
                <Route path="/profile"  element={<ProfileSettings />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>

              {/* ── ADMIN ── */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
