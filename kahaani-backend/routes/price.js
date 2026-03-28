import express from "express";
import { calculateFairPrice, getPriceTransparency } from "../services/priceService.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ─── POST /api/price/calculate ────────────────────────────────────────────
router.post("/calculate", authenticate, async (req, res, next) => {
  try {
    const {
      artForm,
      state,
      rarity,
      timeSpentHours,
      materials,
      dimensionsCm,
      isCustomCommission,
    } = req.body;

    if (!artForm || !state) {
      return res.status(400).json({ error: "artForm and state are required" });
    }

    const priceData = calculateFairPrice({
      artForm,
      state,
      rarity: rarity || "uncommon",
      timeSpentHours: timeSpentHours || 10,
      materials: materials || [],
      dimensionsCm,
      isCustomCommission: isCustomCommission || false,
    });

    const transparency = getPriceTransparency(priceData);

    res.json({ success: true, ...priceData, transparency });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/price/transparency/:artworkId ──────────────────────────────
// Public-facing price breakdown for a listed artwork
router.get("/transparency/:artworkId", async (req, res, next) => {
  try {
    const { db } = await import("../config/firebase.js");
    const snap = await db.collection("artworks").doc(req.params.artworkId).get();

    if (!snap.exists) return res.status(404).json({ error: "Artwork not found" });

    const artwork = snap.data();

    if (!artwork.price || !artwork.artistEarnings) {
      return res.status(404).json({ error: "Price breakdown not available for this artwork" });
    }

    const platformFee = artwork.price - artwork.artistEarnings;
    const artistPercent = Math.round((artwork.artistEarnings / artwork.price) * 100);

    res.json({
      success: true,
      price: artwork.price,
      artistEarnings: artwork.artistEarnings,
      platformFee,
      artistPercent,
      platformPercent: 100 - artistPercent,
      message: `₹${artwork.artistEarnings} goes directly to ${artwork.artistName}'s UPI account. Kahaani retains ₹${platformFee} to sustain the platform.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
