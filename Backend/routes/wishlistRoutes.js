// routes/wishlistRoutes.js
// Wishlist stored as array of productIds on the User document
// GET    /api/wishlist          — get user's wishlist (populated)
// POST   /api/wishlist/:id      — add product to wishlist
// DELETE /api/wishlist/:id      — remove product from wishlist
import express from "express";
import User    from "../models/User.js";
import Product from "../models/Product.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ─── GET WISHLIST ─────────────────────────────────────────────── */
router.get("/", protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("wishlist");
    if (!user.wishlist?.length) return res.json([]);
    const products = await Product.find({ _id: { $in: user.wishlist } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch wishlist" });
  }
});

/* ─── ADD TO WISHLIST ──────────────────────────────────────────── */
router.post("/:id", protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist) user.wishlist = [];
    const alreadyAdded = user.wishlist.some(
      (id) => id.toString() === req.params.id
    );
    if (!alreadyAdded) {
      user.wishlist.push(req.params.id);
      await user.save();
    }
    res.json({ msg: "Added to wishlist", count: user.wishlist.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to add to wishlist" });
  }
});

/* ─── REMOVE FROM WISHLIST ─────────────────────────────────────── */
router.delete("/:id", protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = (user.wishlist || []).filter(
      (id) => id.toString() !== req.params.id
    );
    await user.save();
    res.json({ msg: "Removed from wishlist", count: user.wishlist.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to remove from wishlist" });
  }
});

/* ─── CHECK IF IN WISHLIST ─────────────────────────────────────── */
router.get("/check/:id", protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("wishlist");
    const saved = (user.wishlist || []).some(
      (id) => id.toString() === req.params.id
    );
    res.json({ saved });
  } catch (err) {
    res.status(500).json({ msg: "Failed to check wishlist" });
  }
});

export default router;
