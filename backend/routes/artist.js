import express from "express";
import { db } from "../config/firebase.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// ─── POST /api/artist/profile ─────────────────────────────────────────────
// Create or update artist profile
router.post("/profile", authenticate, async (req, res, next) => {
  try {
    const {
      name,
      nameInNativeLanguage,
      state,
      district,
      village,
      artForms,
      bio,
      bioHindi,
      profileImageUrl,
      upiId,
      phoneNumber,
      languagesSpoken,
      yearsOfExperience,
      awards,
      isCooperativeMember,
      cooperativeName,
    } = req.body;

    if (!name || !state || !artForms?.length) {
      return res.status(400).json({ error: "name, state, and artForms are required" });
    }

    // Validate UPI format
    if (upiId && !upiId.includes("@")) {
      return res.status(400).json({ error: "Invalid UPI ID format (e.g., name@upi)" });
    }

    const profile = {
      uid: req.user.uid,
      name,
      nameInNativeLanguage: nameInNativeLanguage || null,
      state,
      district: district || null,
      village: village || null,
      artForms,
      bio: bio || null,
      bioHindi: bioHindi || null,
      profileImageUrl: profileImageUrl || null,
      upiId: upiId || null,
      phoneNumber: phoneNumber || null,
      languagesSpoken: languagesSpoken || [],
      yearsOfExperience: yearsOfExperience || null,
      awards: awards || [],
      isCooperativeMember: isCooperativeMember ?? false,
      cooperativeName: cooperativeName || null,
      role: "artist",
      totalSales: 0,
      totalEarnings: 0,
      totalArtworks: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("artists").doc(req.user.uid).set(profile, { merge: true });

    // Also update user role in users collection
    await db.collection("users").doc(req.user.uid).set(
      { role: "artist", updatedAt: new Date().toISOString() },
      { merge: true }
    );

    res.status(201).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/artist/profile ──────────────────────────────────────────────
// Get own profile
router.get("/profile", authenticate, async (req, res, next) => {
  try {
    const snap = await db.collection("artists").doc(req.user.uid).get();
    if (!snap.exists) return res.status(404).json({ error: "Artist profile not found" });
    res.json({ success: true, profile: snap.data() });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/artist/:id ──────────────────────────────────────────────────
// Get any artist's public profile
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const snap = await db.collection("artists").doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: "Artist not found" });

    const profile = snap.data();
    // Remove sensitive info
    const { upiId, phoneNumber, ...publicProfile } = profile;

    // Get their listed artworks
    const artworksSnap = await db
      .collection("artworks")
      .where("artistId", "==", req.params.id)
      .where("status", "==", "listed")
      .orderBy("createdAt", "desc")
      .limit(12)
      .get();

    const artworks = artworksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    res.json({ success: true, profile: publicProfile, artworks });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/artist ───────────────────────────────────────────────────────
// List artists with optional filters
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { state, artForm, limit = 20 } = req.query;

    let query = db.collection("artists").limit(parseInt(limit));

    if (state) query = query.where("state", "==", state);

    const snap = await query.get();
    let artists = snap.docs.map((d) => {
      const { upiId, phoneNumber, ...safe } = d.data();
      return { id: d.id, ...safe };
    });

    if (artForm) {
      artists = artists.filter((a) => a.artForms?.includes(artForm));
    }

    res.json({ success: true, artists });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/artist/:id/earnings ─────────────────────────────────────────
// Artist's own earnings summary
router.get("/:id/earnings", authenticate, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.uid) {
      return res.status(403).json({ error: "Access denied" });
    }

    const ordersSnap = await db
      .collection("orders")
      .where("artistId", "==", req.user.uid)
      .where("status", "==", "completed")
      .orderBy("completedAt", "desc")
      .get();

    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const totalEarnings = orders.reduce((sum, o) => sum + (o.artistEarnings || 0), 0);
    const totalOrders = orders.length;

    const byMonth = {};
    orders.forEach((o) => {
      const month = o.completedAt?.slice(0, 7);
      if (month) {
        byMonth[month] = (byMonth[month] || 0) + (o.artistEarnings || 0);
      }
    });

    res.json({
      success: true,
      totalEarnings,
      totalOrders,
      byMonth,
      recentOrders: orders.slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
