import express from "express";
import NewArrival from "../models/NewArrival.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC: Get all new arrivals
========================= */
router.get("/", async (req, res) => {
  try {
    const arrivals = await NewArrival.find().sort({ createdAt: -1 });
    res.json(arrivals);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch new arrivals" });
  }
});

/* =========================
   ADMIN: Create new arrival
========================= */
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { title, price, href, img1, img2 } = req.body;
    if (!title || !price || !href || !img1)
      return res.status(400).json({ msg: "Title, price, link and image are required" });

    const arrival = await NewArrival.create({ title, price, href, img1, img2 });
    res.status(201).json(arrival);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create new arrival" });
  }
});

/* =========================
   ADMIN: Delete new arrival
========================= */
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const arrival = await NewArrival.findById(req.params.id);
    if (!arrival) return res.status(404).json({ msg: "Not found" });
    await arrival.deleteOne();
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete" });
  }
});

export default router;
