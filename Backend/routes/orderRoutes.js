import express from "express";
import Order from "../models/Order.js";
import { protectUser, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   ADMIN: Get all orders
========================= */
router.get("/", protectAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/* =========================
   USER: Get My Orders
========================= */
router.get("/myorders", protectUser, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);
});

/* =========================
   ADMIN: Update Order Status
========================= */
router.put("/:id", protectAdmin, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.status = status;
  await order.save();

  res.json(order);
});

/* =========================
   USER: Create Order
========================= */
router.post("/", protectUser, async (req, res) => {
  try {
    const order = new Order({
      user: req.user._id, // NEVER trust req.body.user
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      paymentStatus: req.body.paymentStatus || "Pending",
      status: "Pending",
      customer: req.body.customer,
      reference: req.body.reference,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;