import express from "express";
import jwt     from "jsonwebtoken";
import User    from "../models/User.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// helper — picks only safe fields to send to the frontend
const safeUser = (user) => ({
  _id:       user._id,
  name:      user.name,
  email:     user.email,
  phone:     user.phone,
  role:      user.role,
  avatar:    user.avatar,   // ✅ included in every response
  createdAt: user.createdAt,
});

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "Please fill in all fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "Email already registered" });

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      token: generateToken(user._id),
      user:  safeUser(user),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ msg: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid email or password" });

    res.json({
      token: generateToken(user._id),
      user:  safeUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   GET CURRENT USER (/me)
========================= */
router.get("/me", protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   UPDATE PROFILE
========================= */
router.put("/update-profile", protectUser, async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body; // ✅ avatar added

    // Check if email is taken by another user
    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ msg: "Email already in use by another account" });
    }

    const user = await User.findById(req.user._id);
    if (name             ) user.name   = name;
    if (email            ) user.email  = email;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar; // ✅ save avatar URL

    await user.save();

    res.json(safeUser(user)); // ✅ returns avatar in response
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   CHANGE PASSWORD
========================= */
router.put("/change-password", protectUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ msg: "Please provide current and new password" });

    if (newPassword.length < 6)
      return res.status(400).json({ msg: "New password must be at least 6 characters" });

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ msg: "Current password is incorrect" });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
