// routes/couponRoutes.js — Phase 4 Backend
// Admin: full CRUD
// Public: POST /api/coupons/validate — check + apply coupon at checkout
import express from "express";
import Coupon from "../models/Coupon.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ─── ADMIN: GET all coupons ──────────────────────────────────────────── */
router.get("/", protectAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch coupons" });
  }
});

/* ─── ADMIN: CREATE coupon ────────────────────────────────────────────── */
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { code, type, value, minOrder, maxUses, expiresAt } = req.body;

    if (!code || !type || value === undefined) {
      return res.status(400).json({ msg: "Code, type, and value are required" });
    }

    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ msg: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code:      code.toUpperCase(),
      type,
      value,
      minOrder:  minOrder  || 0,
      maxUses:   maxUses   || null,
      expiresAt: expiresAt || null,
    });

    res.status(201).json(coupon);
  } catch (err) {
    console.error("Create coupon error:", err);
    res.status(500).json({ msg: "Failed to create coupon" });
  }
});

/* ─── ADMIN: UPDATE coupon (toggle active, edit fields) ───────────────── */
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!coupon) return res.status(404).json({ msg: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update coupon" });
  }
});

/* ─── ADMIN: DELETE coupon ────────────────────────────────────────────── */
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ msg: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete coupon" });
  }
});

/* ─── PUBLIC: VALIDATE coupon (used at checkout) ─────────────────────── */
// POST /api/coupons/validate   body: { code, cartTotal }
// Returns: { valid, discount, finalTotal, coupon }
router.post("/validate", async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;

    if (!code) return res.status(400).json({ msg: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ valid: false, msg: "Invalid coupon code" });
    if (!coupon.active) return res.status(400).json({ valid: false, msg: "This coupon is no longer active" });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ valid: false, msg: "This coupon has expired" });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ valid: false, msg: "This coupon has reached its usage limit" });
    }
    if (coupon.minOrder && cartTotal < coupon.minOrder) {
      return res.status(400).json({
        valid: false,
        msg: `Minimum order of ₦${coupon.minOrder.toLocaleString()} required for this coupon`,
      });
    }

    const discount =
      coupon.type === "percent"
        ? (cartTotal * coupon.value) / 100
        : Math.min(coupon.value, cartTotal); // fixed can't exceed cart

    res.json({
      valid:      true,
      discount:   Math.round(discount),
      finalTotal: Math.max(0, cartTotal - discount),
      coupon: {
        _id:   coupon._id,
        code:  coupon.code,
        type:  coupon.type,
        value: coupon.value,
      },
    });
  } catch (err) {
    console.error("Validate coupon error:", err);
    res.status(500).json({ msg: "Failed to validate coupon" });
  }
});

/* ─── PUBLIC: REDEEM coupon (increment usedCount after order placed) ──── */
// Called internally after a successful order
// POST /api/coupons/redeem   body: { code }
router.post("/redeem", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ msg: "Code required" });

    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );

    res.json({ msg: "Coupon redeemed" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to redeem coupon" });
  }
});

export default router;
