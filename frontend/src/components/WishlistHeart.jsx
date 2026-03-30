// components/WishlistHeart.jsx
// Drop this into any product card to get a save/unsave heart button
// Usage: <WishlistHeart productId={product._id} />
import { useWishlist } from "../context/WishlistContext";
import "../assets/css/wishlisheart.css";

export default function WishlistHeart({ productId, style = {} }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(productId);

  return (
    <button
      className={`wh-btn ${saved ? "wh-btn-saved" : ""}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(productId); }}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      style={style}
    >
      <i className={`${saved ? "fas" : "far"} fa-heart`} />
    </button>
  );
}
