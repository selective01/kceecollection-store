// models/Coupon.js — Phase 4 Backend
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code:       { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:       { type: String, enum: ["percent", "fixed"], required: true },
    value:      { type: Number, required: true, min: 0 },
    minOrder:   { type: Number, default: 0 },         // min cart total to apply
    maxUses:    { type: Number, default: null },       // null = unlimited
    usedCount:  { type: Number, default: 0 },
    expiresAt:  { type: Date,   default: null },
    active:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: is the coupon currently valid?
couponSchema.virtual("isValid").get(function () {
  if (!this.active) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;
  return true;
});

export default mongoose.model("Coupon", couponSchema);
