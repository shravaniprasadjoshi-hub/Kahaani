import express from "express";
import { db } from "../config/firebase.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { getThumbnailUrl } from "../config/cloudinary.js";

const router = express.Router();

// ─── POST /api/artwork ─────────────────────────────────────────────────────
// Create a new artwork listing (draft)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const {
      title,
      artForm,
      state,
      imageUrl,
      imagePublicId,
      audioUrl,
      transcript,
      storyCard,
      price,
      artistEarnings,
      dimensions,
      materials,
      timeSpentHours,
      isCommissionOpen,
    } = req.body;

    if (!artForm || !state || !imageUrl) {
      return res.status(400).json({ error: "artForm, state, and imageUrl are required" });
    }

    const artistId = req.user.uid;

    // Verify artist exists
    const artistSnap = await db.collection("artists").doc(artistId).get();
    if (!artistSnap.exists) {
      return res.status(403).json({ error: "Artist profile not found. Please complete your profile." });
    }

    const artist = artistSnap.data();

    const artwork = {
      title: title || storyCard?.title || "Untitled",
      artForm,
      state,
      imageUrl,
      imagePublicId: imagePublicId || null,
      thumbnailUrl: imagePublicId ? getThumbnailUrl(imagePublicId) : imageUrl,
      audioUrl: audioUrl || null,
      transcript: transcript || null,
      storyCard: storyCard || null,
      price: price || null,
      artistEarnings: artistEarnings || null,
      dimensions: dimensions || null,
      materials: materials || [],
      timeSpentHours: timeSpentHours || null,
      isCommissionOpen: isCommissionOpen ?? true,
      status: storyCard ? "listed" : "draft",
      artistId,
      artistName: artist.name,
      artistState: artist.state,
      artistProfileUrl: artist.profileImageUrl || null,
      rarity: storyCard?.rarity || "uncommon",
      culturalLineage: storyCard?.culturalLineage || [],
      mood: storyCard?.mood || [],
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("artworks").add(artwork);

    res.status(201).json({
      success: true,
      artworkId: docRef.id,
      artwork: { id: docRef.id, ...artwork },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/artwork ───────────────────────────────────────────────────────
// List artworks with filters
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const {
      artForm,
      state,
      rarity,
      minPrice,
      maxPrice,
      commissionOnly,
      limit = 20,
      lastDocId,
    } = req.query;

    let query = db
      .collection("artworks")
      .where("status", "==", "listed")
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit));

    if (artForm) query = query.where("artForm", "==", artForm);
    if (state) query = query.where("state", "==", state);
    if (rarity) query = query.where("rarity", "==", rarity);
    if (commissionOnly === "true") query = query.where("isCommissionOpen", "==", true);

    // Pagination
    if (lastDocId) {
      const lastDoc = await db.collection("artworks").doc(lastDocId).get();
      if (lastDoc.exists) query = query.startAfter(lastDoc);
    }

    const snap = await query.get();
    let artworks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Price filter (Firestore range queries require index, do client-side for simplicity)
    if (minPrice) artworks = artworks.filter((a) => a.price >= parseInt(minPrice));
    if (maxPrice) artworks = artworks.filter((a) => a.price <= parseInt(maxPrice));

    res.json({
      success: true,
      artworks,
      count: artworks.length,
      hasMore: artworks.length === parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/artwork/:id ────────────────────────────────────────────────────
// Get single artwork detail
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const snap = await db.collection("artworks").doc(req.params.id).get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    // Increment view count
    snap.ref.update({ viewCount: (snap.data().viewCount || 0) + 1 });

    res.json({ success: true, artwork: { id: snap.id, ...snap.data() } });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/artwork/:id ──────────────────────────────────────────────────
// Update artwork (artist only)
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const snap = await db.collection("artworks").doc(req.params.id).get();

    if (!snap.exists) return res.status(404).json({ error: "Artwork not found" });
    if (snap.data().artistId !== req.user.uid) {
      return res.status(403).json({ error: "Not your artwork" });
    }

    const allowed = [
      "title", "price", "artistEarnings", "storyCard", "isCommissionOpen",
      "status", "materials", "dimensions", "timeSpentHours",
    ];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    updates.updatedAt = new Date().toISOString();

    await snap.ref.update(updates);
    res.json({ success: true, updates });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/artwork/:id ─────────────────────────────────────────────────
// Soft delete artwork
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const snap = await db.collection("artworks").doc(req.params.id).get();

    if (!snap.exists) return res.status(404).json({ error: "Artwork not found" });
    if (snap.data().artistId !== req.user.uid) {
      return res.status(403).json({ error: "Not your artwork" });
    }

    await snap.ref.update({ status: "deleted", deletedAt: new Date().toISOString() });
    res.json({ success: true, message: "Artwork removed" });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/artwork/:id/like ──────────────────────────────────────────────
router.post("/:id/like", authenticate, async (req, res, next) => {
  try {
    const artworkRef = db.collection("artworks").doc(req.params.id);
    const snap = await artworkRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Artwork not found" });

    const likeRef = artworkRef.collection("likes").doc(req.user.uid);
    const likeSnap = await likeRef.get();

    if (likeSnap.exists) {
      await likeRef.delete();
      await artworkRef.update({ likeCount: Math.max((snap.data().likeCount || 1) - 1, 0) });
      return res.json({ success: true, liked: false });
    }

    await likeRef.set({ likedAt: new Date().toISOString() });
    await artworkRef.update({ likeCount: (snap.data().likeCount || 0) + 1 });
    res.json({ success: true, liked: true });
  } catch (err) {
    next(err);
  }
});

export default router;
