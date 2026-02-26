import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import connectDB from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dns from "node:dns/promises";

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // temporarily allow all
  })
);
app.use(express.json());
app.use("/api/orders", orderRoutes);

// Root test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ===============================
   PAYSTACK INITIALIZE PAYMENT
================================= */

app.post("/api/paystack/initialize", async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack uses kobo
        metadata,
        callback_url: "http://localhost:5173/payment-success",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

app.get("/api/paystack/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);



// API test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});