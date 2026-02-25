import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      country: String,
      state: String,
      postalCode: String,
    },
    items: Array,
    amount: Number,
    reference: String,
    status: {
      type: String,
      default: "Paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);