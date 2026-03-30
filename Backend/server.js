import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import payments from "./routes/payments.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dns from "node:dns/promises";
import authRoutes from "./routes/authRoutes.js";
import newArrivalRoutes from "./routes/newArrivalRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes  from "./routes/couponRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
connectDB();

const app = express();

// 🔥 REQUIRED
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kcee-collection.vercel.app",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/paystack", payments);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/newarrivals", newArrivalRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons",  couponRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Root test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// API test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});