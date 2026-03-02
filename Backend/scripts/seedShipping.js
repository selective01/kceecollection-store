import mongoose from "mongoose";
import dotenv from "dotenv";
import ShippingRate from "../models/ShippingRate.js";

dotenv.config();

const shippingRates = [
  { state: "Lagos", baseRate: 1500, perKgRate: 300, provider: "Standard Delivery", deliveryDays: "1-2 business days" },
  { state: "FCT Abuja", baseRate: 2000, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-3 business days" },
  { state: "Rivers", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Anambra", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Enugu", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Imo", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Abia", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Delta", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Edo", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Ogun", baseRate: 1800, perKgRate: 350, provider: "Standard Delivery", deliveryDays: "1-3 business days" },
  { state: "Oyo", baseRate: 2000, perKgRate: 350, provider: "Standard Delivery", deliveryDays: "2-3 business days" },
  { state: "Osun", baseRate: 2000, perKgRate: 350, provider: "Standard Delivery", deliveryDays: "2-3 business days" },
  { state: "Ekiti", baseRate: 2200, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Ondo", baseRate: 2200, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Kano", baseRate: 3000, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Kaduna", baseRate: 3000, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Katsina", baseRate: 3200, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Jigawa", baseRate: 3200, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Sokoto", baseRate: 3500, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-6 business days" },
  { state: "Kebbi", baseRate: 3500, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-6 business days" },
  { state: "Zamfara", baseRate: 3500, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-6 business days" },
  { state: "Niger", baseRate: 2800, perKgRate: 450, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Kwara", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Kogi", baseRate: 2800, perKgRate: 450, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Benue", baseRate: 3000, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Nasarawa", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
  { state: "Plateau", baseRate: 3000, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Bauchi", baseRate: 3200, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Gombe", baseRate: 3200, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Taraba", baseRate: 3500, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-6 business days" },
  { state: "Adamawa", baseRate: 3500, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-6 business days" },
  { state: "Borno", baseRate: 4000, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-7 business days" },
  { state: "Yobe", baseRate: 4000, perKgRate: 600, provider: "Standard Delivery", deliveryDays: "4-7 business days" },
  { state: "Akwa Ibom", baseRate: 2800, perKgRate: 450, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Cross River", baseRate: 2800, perKgRate: 450, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Bayelsa", baseRate: 3000, perKgRate: 500, provider: "Standard Delivery", deliveryDays: "3-5 business days" },
  { state: "Ebonyi", baseRate: 2500, perKgRate: 400, provider: "Standard Delivery", deliveryDays: "2-4 business days" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    let created = 0;
    let skipped = 0;

    for (const rate of shippingRates) {
      const exists = await ShippingRate.findOne({ state: rate.state });
      if (!exists) {
        await ShippingRate.create(rate);
        created++;
        console.log(`✅ Created: ${rate.state}`);
      } else {
        skipped++;
        console.log(`⏭ Skipped (already exists): ${rate.state}`);
      }
    }

    console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
