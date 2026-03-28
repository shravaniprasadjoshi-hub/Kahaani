import express from "express";
import { db } from "../config/firebase.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ─── POST /api/buyer/profile ───────────────────────────────────────────────
router.post("/profile", authenticate, async (req, res, next) => {
  try {
    const { name, email, city, state, preferredLanguage } = req.body;

    const profile = {
      uid: req.user.uid,
      name: name || req.user.name,
      email: email || req.user.email,
      city: city || null,
      state: state || null,
      preferredLanguage: preferredLanguage || "en",
      role: "buyer",
      totalPurchases: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("buyers").doc(req.user.uid).set(profile, { merge: true });
    await db.collection("users").doc(req.user.uid).set(
      { role: "buyer", updatedAt: new Date().toISOString() },
      { merge: true }
    );

    res.status(201).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/buyer/profile ────────────────────────────────────────────────
router.get("/profile", authenticate, async (req, res, next) => {
  try {
    const snap = await db.collection("buyers").doc(req.user.uid).get();
    if (!snap.exists) return res.status(404).json({ error: "Buyer profile not found" });
    res.json({ success: true, profile: snap.data() });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/buyer/orders ─────────────────────────────────────────────────
router.get("/orders", authenticate, async (req, res, next) => {
  try {
    const snap = await db
      .collection("orders")
      .where("buyerId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/buyer/commission ──────────────────────────────────────────
// Submit a commission request to an artist
router.post("/commission", authenticate, async (req, res, next) => {
  try {
    const {
      artistId,
      artForm,
      description,
      referenceImageUrl,
      budgetMin,
      budgetMax,
      deadline,
    } = req.body;

    if (!artistId || !artForm || !description) {
      return res.status(400).json({ error: "artistId, artForm, description required" });
    }

    // Check artist exists and accepts commissions
    const artistSnap = await db.collection("artists").doc(artistId).get();
    if (!artistSnap.exists) return res.status(404).json({ error: "Artist not found" });

    const buyerSnap = await db.collection("buyers").doc(req.user.uid).get();
    const buyer = buyerSnap.exists ? buyerSnap.data() : {};

    const commission = {
      buyerId: req.user.uid,
      buyerName: buyer.name || "Anonymous",
      artistId,
      artForm,
      description,
      referenceImageUrl: referenceImageUrl || null,
      budgetMin: budgetMin || null,
      budgetMax: budgetMax || null,
      deadline: deadline || null,
      status: "pending", // pending | accepted | in_progress | completed | declined
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("commissions").add(commission);

    res.status(201).json({
      success: true,
      commissionId: docRef.id,
      message: "Commission request sent to the artist",
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/buyer/commissions ────────────────────────────────────────────
router.get("/commissions", authenticate, async (req, res, next) => {
  try {
    const snap = await db
      .collection("commissions")
      .where("buyerId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();

    res.json({
      success: true,
      commissions: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/buyer/wishlist/:artworkId ──────────────────────────────────
router.post("/wishlist/:artworkId", authenticate, async (req, res, next) => {
  try {
    const wishlistRef = db
      .collection("buyers")
      .doc(req.user.uid)
      .collection("wishlist")
      .doc(req.params.artworkId);

    const snap = await wishlistRef.get();
    if (snap.exists) {
      await wishlistRef.delete();
      return res.json({ success: true, wishlisted: false });
    }

    await wishlistRef.set({ addedAt: new Date().toISOString() });
    res.json({ success: true, wishlisted: true });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/buyer/wishlist ──────────────────────────────────────────────
router.get("/wishlist", authenticate, async (req, res, next) => {
  try {
    const wishlistSnap = await db
      .collection("buyers")
      .doc(req.user.uid)
      .collection("wishlist")
      .get();

    const artworkIds = wishlistSnap.docs.map((d) => d.id);

    if (!artworkIds.length) return res.json({ success: true, artworks: [] });

    // Fetch artwork details
    const artworks = await Promise.all(
      artworkIds.map(async (id) => {
        const snap = await db.collection("artworks").doc(id).get();
        return snap.exists ? { id: snap.id, ...snap.data() } : null;
      })
    );

    res.json({ success: true, artworks: artworks.filter(Boolean) });
  } catch (err) {
    next(err);
  }
});

export default router;
