import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all orders (Admin)
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/:id", protect, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Not found" });

  order.status = status;
  await order.save();

  res.json(order);
});

// CREATE order
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/orders hit");
    console.log("Request body:", req.body);

    const order = new Order({
      user: req.body.user,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      paymentStatus: req.body.paymentStatus || "Pending",
      status: "Pending"
    });

    const createdOrder = await order.save();
    console.log("Order saved:", createdOrder);

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
});
export default router;