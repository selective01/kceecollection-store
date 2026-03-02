import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import ShippingRate from "../models/ShippingRate.js";

const router = express.Router();

/* =========================
   NIGERIAN STATES LIST
========================= */
export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

/* =========================
   DHL RATE CALCULATOR (STUB)
   Replace with real DHL API when credentials are ready
   Docs: https://developer.dhl.com/api-reference/dhl-express-mydhl-api
========================= */
const getDHLRate = async ({ weight, length, width, height, destinationCountry }) => {
  const DHL_API_KEY = process.env.DHL_API_KEY;
  const DHL_API_SECRET = process.env.DHL_API_SECRET;

  if (!DHL_API_KEY || !DHL_API_SECRET) {
    // Return null to fall back to local rates
    return null;
  }

  try {
    // TODO: Uncomment and configure when DHL credentials are ready
    // const response = await fetch("https://express.api.dhl.com/mydhlapi/rates", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Basic ${Buffer.from(`${DHL_API_KEY}:${DHL_API_SECRET}`).toString("base64")}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     customerDetails: {
    //       shipperDetails: { postalCode: "900001", cityName: "Lagos", countryCode: "NG" },
    //       receiverDetails: { postalCode: "000000", cityName: destinationCity, countryCode: destinationCountry },
    //     },
    //     accounts: [{ typeCode: "shipper", number: process.env.DHL_ACCOUNT_NUMBER }],
    //     productCode: "P",
    //     localProductCode: "P",
    //     plannedShippingDateAndTime: new Date().toISOString(),
    //     unitOfMeasurement: "metric",
    //     packages: [{ weight, dimensions: { length, width, height } }],
    //   }),
    // });
    // const data = await response.json();
    // return data.products?.[0]?.totalPrice?.[0]?.price || null;
    return null;
  } catch {
    return null;
  }
};

/* =========================
   GIG LOGISTICS RATE CALCULATOR (STUB)
   Replace with real GIG API when credentials are ready
   Docs: https://giglogistics.com/api
========================= */
const getGIGRate = async ({ weight, originState, destinationState }) => {
  const GIG_API_KEY = process.env.GIG_API_KEY;
  const GIG_BASE_URL = process.env.GIG_BASE_URL || "https://api.giglogistics.com";

  if (!GIG_API_KEY) {
    return null;
  }

  try {
    // TODO: Uncomment and configure when GIG credentials are ready
    // const response = await fetch(`${GIG_BASE_URL}/api/price`, {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${GIG_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     originState,
    //     destinationState,
    //     weight,
    //     shipmentType: "regular",
    //   }),
    // });
    // const data = await response.json();
    // return data.price || null;
    return null;
  } catch {
    return null;
  }
};

/* =========================
   FALLBACK: Get rate from admin-managed DB rates
========================= */
const getFallbackRate = async (state, country, weight) => {
  if (country?.toLowerCase() !== "nigeria") {
    // International flat rate fallback
    return { price: 25000, provider: "DHL (estimated)", days: "7-14 business days" };
  }

  const rate = await ShippingRate.findOne({
    state: { $regex: new RegExp(state, "i") }
  });

  if (!rate) {
    // Default Nigerian rate if state not found
    return { price: 3500, provider: "Standard Delivery", days: "3-7 business days" };
  }

  // Apply weight multiplier (base rate + extra per kg over 1kg)
  const extraWeight = Math.max(0, weight - 1);
  const price = rate.baseRate + (extraWeight * (rate.perKgRate || 500));

  return {
    price: Math.round(price),
    provider: rate.provider || "Standard Delivery",
    days: rate.deliveryDays || "3-5 business days",
  };
};

/* =========================
   PUBLIC: Calculate Shipping
========================= */
router.post("/calculate", async (req, res) => {
  try {
    const { state, country, weight = 1, length = 20, width = 15, height = 10, items = [] } = req.body;

    if (!state && !country) {
      return res.status(400).json({ msg: "State or country is required" });
    }

    // Calculate total weight from items if provided
    const totalWeight = items.length > 0
      ? items.reduce((sum, item) => sum + ((item.weight || 0.5) * (item.quantity || 1)), 0)
      : weight;

    const results = [];

    // Try DHL (international or domestic)
    const dhlRate = await getDHLRate({
      weight: totalWeight, length, width, height,
      destinationCountry: country?.toUpperCase().slice(0, 2) || "NG",
    });

    if (dhlRate) {
      results.push({ provider: "DHL Express", price: dhlRate, days: "2-5 business days", logo: "dhl" });
    }

    // Try GIG (domestic Nigeria)
    if (country?.toLowerCase() === "nigeria" || !country) {
      const gigRate = await getGIGRate({
        weight: totalWeight,
        originState: "Lagos",
        destinationState: state,
      });

      if (gigRate) {
        results.push({ provider: "GIG Logistics", price: gigRate, days: "1-3 business days", logo: "gig" });
      }
    }

    // Always include fallback rate
    const fallback = await getFallbackRate(state, country, totalWeight);
    results.push({ provider: fallback.provider, price: fallback.price, days: fallback.days, logo: "standard" });

    res.json({ rates: results, weight: totalWeight });
  } catch (err) {
    console.error("Shipping calc error:", err);
    res.status(500).json({ msg: "Failed to calculate shipping" });
  }
});

/* =========================
   PUBLIC: Get all shipping rates
========================= */
router.get("/rates", async (req, res) => {
  try {
    const rates = await ShippingRate.find().sort({ state: 1 });
    res.json(rates);
  } catch {
    res.status(500).json({ msg: "Failed to fetch rates" });
  }
});

/* =========================
   ADMIN: Create/Update shipping rate
========================= */
router.post("/rates", protectAdmin, async (req, res) => {
  try {
    const { state, baseRate, perKgRate, provider, deliveryDays } = req.body;
    if (!state || !baseRate) return res.status(400).json({ msg: "State and base rate are required" });

    const existing = await ShippingRate.findOne({ state: { $regex: new RegExp(`^${state}$`, "i") } });

    if (existing) {
      existing.baseRate = baseRate;
      existing.perKgRate = perKgRate || 500;
      existing.provider = provider || "Standard Delivery";
      existing.deliveryDays = deliveryDays || "3-5 business days";
      await existing.save();
      return res.json(existing);
    }

    const rate = await ShippingRate.create({ state, baseRate, perKgRate: perKgRate || 500, provider, deliveryDays });
    res.status(201).json(rate);
  } catch {
    res.status(500).json({ msg: "Failed to save rate" });
  }
});

/* =========================
   ADMIN: Delete shipping rate
========================= */
router.delete("/rates/:id", protectAdmin, async (req, res) => {
  try {
    await ShippingRate.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Failed to delete" });
  }
});

export default router;
