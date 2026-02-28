import express from "express";
import axios from "axios";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/verify/:reference", async (req, res) => {
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

    const data = response.data.data;

    if (data.status === "success") {
      return res.json({ success: true }); // ✅ just confirm payment, don't save order
    }

    res.status(400).json({ success: false });

  } catch (error) {
    console.error("Verify error:", error.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/initialize", async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // convert to kobo
        metadata,
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
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

export default router;