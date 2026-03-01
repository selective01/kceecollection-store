import mongoose from "mongoose";

const newArrivalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    href: { type: String, required: true },
    img1: { type: String, required: true },
    img2: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("NewArrival", newArrivalSchema);
