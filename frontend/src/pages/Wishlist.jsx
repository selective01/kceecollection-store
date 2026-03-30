// Wishlist.jsx — Saved items page
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";                  // ✅ removed useNavigate
import { useAuth } from "../context/useAuth";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/useCart";
import SEO from "../components/SEO";
import "../assets/css/wishlist.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const categoryHref = (cat) => {
  const map = {
    "Bags":"/bags","Caps":"/caps","Club Jersey":"/club-jersey",
    "Designer Shirts":"/designer-shirts","Hoodies":"/hoodies",
    "Jeans":"/jeans","Jean Shorts":"/jean-shorts","Joggers":"/joggers",
    "Perfume":"/perfume","Polo":"/polo","Retro Jersey":"/retro-jersey",
    "Shoes":"/shoes","Shorts":"/shorts","Sleeveless":"/sleeveless",
    "Slippers":"/slippers","Sneakers":"/sneakers","T-Shirts":"/t-shirts",
    "Watches":"/watches",
  };
  return map[cat] || "/";
};

export default function Wishlist() {
  const { user }                     = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart }                = useCart();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    let cancelled = false;

    // ✅ All setState calls are inside promise callbacks — never the effect body
    Promise.resolve(wishlist.length)
      .then((len) => {
        if (cancelled) return;
        if (len === 0) { setProducts([]); return; }

        setLoading(true);

        const req = user
          ? fetch(`${BASE_URL}/api/wishlist`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
          : fetch(`${BASE_URL}/api/products`);

        return req
          .then((r) => r.json())
          .then((data) => {
            if (cancelled) return;
            const result = user ? data : data.filter((p) => wishlist.includes(p._id));
            setProducts(result);
          })
          .catch(console.error)
          .finally(() => { if (!cancelled) setLoading(false); });
      });

    return () => { cancelled = true; };
  }, [wishlist.length, user]); // eslint-disable-line

  return (
    <div className="wl-shell">
      <SEO title="Wishlist" description="Your saved items at Kcee Collection" url="https://Kcee_Collection.com/wishlist" />

      <div className="wl-header">
        <div>
          <p className="wl-eyebrow">Saved Items</p>
          <h1 className="wl-title">My Wishlist</h1>
        </div>
        {products.length > 0 && (
          <span className="wl-count">{products.length} item{products.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {loading ? (
        <div className="wl-grid">
          {Array.from({ length: 4 }, (_, i) => (
            <div className="wl-card" key={i}>
              <div className="wl-skeleton-img" />
              <div className="wl-card-body">
                <div className="wl-skeleton-line" style={{ width: "70%" }} />
                <div className="wl-skeleton-line" style={{ width: "40%", marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="wl-empty">
          <div className="wl-empty-icon"><i className="fas fa-heart" /></div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love and come back to them anytime.</p>
          <Link to="/" className="wl-shop-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="wl-grid">
          {products.map((product) => (
            <div className="wl-card" key={product._id}>
              {/* Heart button */}
              <button
                className="wl-heart-btn wl-heart-active"
                onClick={() => toggleWishlist(product._id)}
                aria-label="Remove from wishlist"
              >
                <i className="fas fa-heart" />
              </button>

              {/* Image */}
              <Link to={categoryHref(product.category)} className="wl-card-img-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="wl-img"
                  loading="lazy"
                />
                {product.stock === 0 && (
                  <div className="wl-out-badge">Out of Stock</div>
                )}
              </Link>

              {/* Info */}
              <div className="wl-card-body">
                <Link to={categoryHref(product.category)} className="wl-card-name">
                  {product.name}
                </Link>
                <p className="wl-card-cat">{product.category}</p>
                <div className="wl-card-footer">
                  <span className="wl-card-price">₦{product.price.toLocaleString()}</span>
                  {user && product.stock !== 0 ? (
                    <button
                      className="wl-add-btn"
                      onClick={() => addToCart({ ...product, id: product._id })}
                    >
                      <i className="fas fa-shopping-cart" /> Add to Cart
                    </button>
                  ) : !user ? (
                    <Link to="/auth" className="wl-add-btn">Login to Buy</Link>
                  ) : (
                    <span className="wl-sold-out">Sold Out</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}