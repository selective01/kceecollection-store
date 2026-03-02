import mongoose from "mongoose";

const shippingRateSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, unique: true },
    baseRate: { type: Number, required: true },
    perKgRate: { type: Number, default: 500 },
    provider: { type: String, default: "Standard Delivery" },
    deliveryDays: { type: String, default: "3-5 business days" },
  },
  { timestamps: true }
);

export default mongoose.model("ShippingRate", shippingRateSchema);
