// routes/messageRoutes.js — Phase 4 Backend
// Public: POST /api/messages (customer contact form)
// Admin: GET, PUT (read/replied), DELETE
import express from "express";
import Message from "../models/Message.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ─── PUBLIC: Submit contact message ─────────────────────────────────── */
// POST /api/messages
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, body } = req.body;

    if (!name || !email || !subject || !body) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email address" });
    }

    const message = await Message.create({ name, email, subject, body });

    res.status(201).json({ msg: "Message sent successfully", id: message._id });
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

/* ─── ADMIN: GET all messages ────────────────────────────────────────── */
router.get("/", protectAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
});

/* ─── ADMIN: GET unread count ────────────────────────────────────────── */
router.get("/unread-count", protectAdmin, async (req, res) => {
  try {
    const count = await Message.countDocuments({ read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get count" });
  }
});

/* ─── ADMIN: UPDATE message (mark read / replied) ────────────────────── */
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const { read, replied } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { ...(read !== undefined && { read }), ...(replied !== undefined && { replied }) },
      { new: true }
    );
    if (!message) return res.status(404).json({ msg: "Message not found" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update message" });
  }
});

/* ─── ADMIN: DELETE message ──────────────────────────────────────────── */
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: "Message deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete message" });
  }
});

export default router;
