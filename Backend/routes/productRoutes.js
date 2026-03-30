// routes/productRoutes.js — Updated with search + filter endpoint
import express from "express";
import Product from "../models/Product.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ─── GET ALL PRODUCTS ─────────────────────────────────────────── */
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

/* ─── SEARCH + FILTER ──────────────────────────────────────────── */
// GET /api/products/search?q=hoodie&category=Hoodies&minPrice=0&maxPrice=50000&sort=newest
router.get("/search", async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, inStock } = req.query;

    const filter = {};

    // Text search across name + description
    if (q && q.trim()) {
      filter.$or = [
        { name:        { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
        { category:    { $regex: q.trim(), $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // In stock only
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Sort
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "price-asc")  sortOption = { price:  1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "name-asc")   sortOption = { name:   1 };

    const products = await Product.find(filter).sort(sortOption).limit(100);
    res.json({ products, total: products.length });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ msg: "Search failed" });
  }
});

/* ─── GET PRODUCTS BY CATEGORY ─────────────────────────────────── */
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch products by category" });
  }
});

/* ─── CREATE PRODUCT ───────────────────────────────────────────── */
router.post("/", protectAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

/* ─── UPDATE PRODUCT ───────────────────────────────────────────── */
router.put("/:id", protectAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  );
  res.json(product);
});

/* ─── DELETE PRODUCT ───────────────────────────────────────────── */
router.delete("/:id", protectAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
