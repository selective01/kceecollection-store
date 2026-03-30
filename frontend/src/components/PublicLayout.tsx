// PublicLayout.tsx — public pages wrapper
import { useLocation } from "react-router-dom";
import Navbar     from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Footer     from "../components/Footer";

const breadcrumbPages = [
  "/bags", "/caps", "/cart", "/club-jersey", "/designer-shirts",
  "/hoodies", "/jeans", "/jean-shorts", "/joggers", "/perfume",
  "/checkout", "/polo", "/retro-jersey", "/shoes", "/shorts",
  "/sleeveless", "/slippers", "/sneakers", "/t-shirts", "/watches",
  "/contact", "/search",
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location       = useLocation();
  const showBreadcrumb = breadcrumbPages.includes(location.pathname);
  const hideNavbar     = location.pathname === "/auth";
  return (
    <>
      {!hideNavbar && <Navbar />}
      {showBreadcrumb && <Breadcrumb />}
      <main className="page-content">{children}</main>
      <Footer />
    </>
  );
}
