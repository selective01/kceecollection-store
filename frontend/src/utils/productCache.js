// src/utils/productCache.js
// Single shared cache for all product fetches across the entire app.
// Import this in ProductPage.jsx and NewArrivals.jsx instead of using local cache objects.

const BASE_URL = import.meta.env.VITE_API_URL;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const store = {};         // { [key]: { data, timestamp } }
const inflight = {};      // { [key]: Promise }  — deduplicates concurrent fetches

const isFresh = (key) =>
  store[key] && Date.now() - store[key].timestamp < CACHE_TTL;

/**
 * Fetch a URL once, cache it, and deduplicate concurrent calls.
 * @param {string} key   - cache key (e.g. "category:TShirts", "newarrivals")
 * @param {string} url   - full URL to fetch
 * @returns {Promise<any>}
 */
export async function fetchCached(key, url) {
  if (isFresh(key)) return store[key].data;
  if (inflight[key]) return inflight[key];

  inflight[key] = fetch(url)
    .then((r) => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
    .then((data) => {
      store[key] = { data, timestamp: Date.now() };
      delete inflight[key];
      return data;
    })
    .catch((err) => {
      delete inflight[key];
      throw err;
    });

  return inflight[key];
}

/**
 * Fetch a product category.
 */
export const fetchCategory = (category) =>
  fetchCached(
    `category:${category}`,
    `${BASE_URL}/api/products/category/${encodeURIComponent(category)}`
  );

/**
 * Fetch new arrivals.
 */
export const fetchNewArrivals = () =>
  fetchCached("newarrivals", `${BASE_URL}/api/newarrivals`);

/**
 * Invalidate a specific key (call after admin creates/edits a product).
 */
export const invalidate = (key) => { delete store[key]; };

/**
 * Prefetch a list of categories in the background — call this on app load
 * to warm the cache before the user navigates.
 */
export const prefetchCategories = (categories) => {
  categories.forEach((cat) => {
    if (!isFresh(`category:${cat}`)) fetchCategory(cat).catch(() => {});
  });
};
