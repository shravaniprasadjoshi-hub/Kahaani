// routes/artForms.js — add to server.js as: app.use("/api/art-forms", artFormsRoutes)
import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

// ─── GET /api/art-forms ───────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { state, rarity } = req.query;
    let query = db.collection("art_forms");

    if (state) query = query.where("state", "==", state);
    if (rarity) query = query.where("rarity", "==", rarity);

    const snap = await query.get();
    const artForms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    res.json({ success: true, artForms });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/art-forms/:id ───────────────────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const snap = await db.collection("art_forms").doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: "Art form not found" });
    res.json({ success: true, artForm: { id: snap.id, ...snap.data() } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/art-forms/stats/overview ───────────────────────────────────
// Dashboard stats: total forms, critically endangered count, etc.
router.get("/stats/overview", async (req, res, next) => {
  try {
    const snap = await db.collection("art_forms").get();
    const all = snap.docs.map((d) => d.data());

    const stats = {
      total: all.length,
      criticallyEndangered: all.filter((a) => a.rarity === "critically_endangered").length,
      rare: all.filter((a) => a.rarity === "rare").length,
      uncommon: all.filter((a) => a.rarity === "uncommon").length,
      common: all.filter((a) => a.rarity === "common").length,
      unescoListed: all.filter((a) => a.unescoListed).length,
      giTagged: all.filter((a) => a.giTagged).length,
      statesCovered: [...new Set(all.map((a) => a.state))].length,
    };

    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
});

export default router;
