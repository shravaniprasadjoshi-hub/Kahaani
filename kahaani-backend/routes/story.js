import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  generateStoryCard,
  generatePriceRationale,
  analyseArtworkImage,
} from "../services/claudeService.js";
import { db } from "../config/firebase.js";

const router = express.Router();

// ─── POST /api/story/generate ─────────────────────────────────────────────────
// Generate story card from voice transcript + art metadata
router.post("/generate", authenticate, async (req, res, next) => {
  try {
    const { transcript, artForm, state, imageUrl, artworkId } = req.body;

    if (!transcript || !artForm || !state) {
      return res.status(400).json({
        error: "transcript, artForm, and state are required",
      });
    }

    // Optionally analyse the image for better context
    let imageDescription = null;
    if (imageUrl) {
      try {
        const imageAnalysis = await analyseArtworkImage(imageUrl);
        imageDescription = imageAnalysis.imageDescription;
      } catch {
        // Continue without image analysis
      }
    }

    // Generate the story card
    const storyCard = await generateStoryCard({
      transcript,
      artForm,
      state,
      imageDescription,
    });

    // Save draft story to Firestore if artworkId provided
    if (artworkId) {
      await db.collection("artworks").doc(artworkId).update({
        storyCard,
        storyGeneratedAt: new Date().toISOString(),
        status: "story_ready",
      });
    }

    res.json({ success: true, storyCard });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: "AI returned malformed story. Please try again." });
    }
    next(err);
  }
});

// ─── POST /api/story/price-rationale ─────────────────────────────────────────
// Get an AI-written explanation for why the price is fair
router.post("/price-rationale", authenticate, async (req, res, next) => {
  try {
    const { artForm, state, rarity, dimensions, timeSpentHours, materials, suggestedPrice } =
      req.body;

    const rationale = await generatePriceRationale({
      artForm,
      state,
      rarity,
      dimensions,
      timeSpentHours,
      materials,
      suggestedPrice,
    });

    res.json({ success: true, rationale });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/story/analyse-image ───────────────────────────────────────────
// Analyse uploaded artwork image using Claude vision
router.post("/analyse-image", authenticate, async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const analysis = await analyseArtworkImage(imageUrl);
    res.json({ success: true, analysis });
  } catch (err) {
    next(err);
  }
});

export default router;
