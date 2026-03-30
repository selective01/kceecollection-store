// Search.jsx — Full search page with filters
// Route: /search?q=hoodie
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import SEO from "../components/SEO";
import "../assets/css/search.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  "All","Bags","Caps","Club Jersey","Designer Shirts","Hoodies","Jeans",
  "Jean Shorts","Joggers","Perfume","Polo","Retro Jersey","Shoes","Shorts",
  "Sleeveless","Slippers","Sneakers","T-Shirts","Watches",
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest"         },
  { value: "price-asc",  label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "name-asc",   label: "A–Z"            },
];

function SkeletonCard() {
  return (
    <div className="sr-card">
      <div className="sr-skeleton-img" />
      <div className="sr-card-body">
        <div className="sr-skeleton-line" style={{ width: "70%", height: 14 }} />
        <div className="sr-skeleton-line" style={{ width: "40%", height: 14, marginTop: 6 }} />
      </div>
    </div>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { user }      = useAuth();
  
  const [query,     setQuery]     = useState(searchParams.get("q") || "");
  const [category,  setCategory]  = useState("All");
  const [sort,      setSort]      = useState("newest");
  const [minPrice,  setMinPrice]  = useState("");
  const [maxPrice,  setMaxPrice]  = useState("");
  const [inStock,   setInStock]   = useState(false);
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [searched,  setSearched]  = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const doSearch = useCallback(async (overrides = {}) => {
    const q   = overrides.query    ?? query;
    const cat = overrides.category ?? category;
    const srt = overrides.sort     ?? sort;
    const min = overrides.minPrice ?? minPrice;
    const max = overrides.maxPrice ?? maxPrice;
    const stk = overrides.inStock  ?? inStock;

    const params = new URLSearchParams();
    if (q)   params.set("q", q);
    if (cat !== "All") params.set("category", cat);
    if (srt) params.set("sort", srt);
    if (min) params.set("minPrice", min);
    if (max) params.set("maxPrice", max);
    if (stk) params.set("inStock", "true");

    setSearchParams(params);
    setLoading(true);
    setSearched(true);

    try {
      const res  = await fetch(`${BASE_URL}/api/products/search?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, sort, minPrice, maxPrice, inStock, setSearchParams]);

  // Run on initial load if ?q= present
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setQuery(q); doSearch({ query: q }); }
  }, []); // eslint-disable-line

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch();
  };

  const handleFilter = (key, value) => {
    if (key === "category") { setCategory(value); doSearch({ category: value }); }
    if (key === "sort")     { setSort(value);     doSearch({ sort: value });     }
    if (key === "inStock")  { setInStock(value);  doSearch({ inStock: value });  }
  };

  const applyPriceFilter = () => doSearch();

  const clearFilters = () => {
    setCategory("All"); setSort("newest");
    setMinPrice(""); setMaxPrice(""); setInStock(false);
    doSearch({ category: "All", sort: "newest", minPrice: "", maxPrice: "", inStock: false });
  };

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

  return (
    <div className="sr-shell">
      <SEO title="Search" description="Search Kcee_Collection products" url="https://Kcee_Collection.com/search" />

      {/* ── Search bar ── */}
      <div className="sr-hero">
        <form className="sr-form" onSubmit={handleSubmit}>
          <i className="fas fa-search sr-form-icon" />
          <input
            className="sr-input"
            type="text"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button type="button" className="sr-clear-btn" onClick={() => { setQuery(""); setProducts([]); setSearched(false); }}>
              <i className="fas fa-times" />
            </button>
          )}
          <button type="submit" className="sr-submit-btn">Search</button>
        </form>
      </div>

      <div className="sr-body">
        {/* ── FILTERS sidebar ── */}
        <aside className={`sr-filters ${filtersOpen ? "sr-filters-open" : ""}`}>
          <div className="sr-filter-head">
            <h3>Filters</h3>
            <button className="sr-clear-link" onClick={clearFilters}>Clear all</button>
          </div>

          {/* Category */}
          <div className="sr-filter-group">
            <p className="sr-filter-label">Category</p>
            <div className="sr-filter-options">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`sr-filter-chip ${category === cat ? "active" : ""}`}
                  onClick={() => handleFilter("category", cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="sr-filter-group">
            <p className="sr-filter-label">Price Range (₦)</p>
            <div className="sr-price-inputs">
              <input
                className="sr-price-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="sr-price-sep">—</span>
              <input
                className="sr-price-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button className="sr-apply-price" onClick={applyPriceFilter}>Apply</button>
          </div>

          {/* In stock */}
          <div className="sr-filter-group">
            <label className="sr-toggle-row">
              <span className="sr-filter-label" style={{ margin: 0 }}>In Stock Only</span>
              <div
                className={`sr-toggle ${inStock ? "sr-toggle-on" : ""}`}
                onClick={() => handleFilter("inStock", !inStock)}
              >
                <div className="sr-toggle-thumb" />
              </div>
            </label>
          </div>
        </aside>

        {/* Mobile filter toggle */}
        <button
          className="sr-mobile-filter-btn"
          onClick={() => setFiltersOpen((p) => !p)}
        >
          <i className={`fas ${filtersOpen ? "fa-times" : "fa-sliders-h"}`} />
          {filtersOpen ? "Close Filters" : "Filters"}
        </button>

        {/* ── RESULTS ── */}
        <div className="sr-results-col">
          {/* Toolbar */}
          {searched && (
            <div className="sr-toolbar">
              <p className="sr-result-count">
                {loading ? "Searching..." : `${products.length} result${products.length !== 1 ? "s" : ""}`}
                {query && <span> for "<strong>{query}</strong>"</span>}
              </p>
              <select
                className="sr-sort-select"
                value={sort}
                onChange={(e) => handleFilter("sort", e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Grid */}
          {!searched && !loading && (
            <div className="sr-empty-state">
              <i className="fas fa-search sr-empty-icon" />
              <p>Search for products, categories, or styles</p>
              <div className="sr-suggestion-chips">
                {["Hoodies","Sneakers","Polo","Watches","Jeans"].map((s) => (
                  <button
                    key={s}
                    className="sr-suggestion"
                    onClick={() => { setQuery(s); doSearch({ query: s }); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="sr-grid">
              {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && searched && products.length === 0 && (
            <div className="sr-empty-state">
              <i className="fas fa-box-open sr-empty-icon" />
              <p>No products found</p>
              <small>Try different keywords or clear your filters</small>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="sr-grid">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={categoryHref(product.category)}
                  className="sr-card"
                >
                  <div className="sr-card-img-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="sr-img"
                      loading="lazy"
                      decoding="async"
                    />
                    {product.stock === 0 && (
                      <div className="sr-out-badge">Out of Stock</div>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <div className="sr-low-badge">Only {product.stock} left</div>
                    )}
                    {/* Hover add to cart */}
                    {user && product.stock !== 0 && (
                      <button
                        className="sr-add-overlay"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({ ...product, id: product._id });
                        }}
                      >
                        <i className="fas fa-shopping-cart" /> Add to Cart
                      </button>
                    )}
                  </div>
                  <div className="sr-card-body">
                    <p className="sr-card-name">{product.name}</p>
                    <div className="sr-card-footer">
                      <span className="sr-card-price">₦{product.price.toLocaleString()}</span>
                      <span className="sr-card-cat">{product.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
