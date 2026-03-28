import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getPassport } from "../services/passportService.js";

const router = express.Router();

// ─── GET /api/passport ────────────────────────────────────────────────────
// Get buyer's full cultural passport
router.get("/", authenticate, async (req, res, next) => {
  try {
    const passport = await getPassport(req.user.uid);
    res.json({ success: true, passport });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/passport/:uid ───────────────────────────────────────────────
// Public passport view (shareable profile)
router.get("/:uid", async (req, res, next) => {
  try {
    const passport = await getPassport(req.params.uid);
    // Only expose public info
    const { summary, stamps, badges } = passport;
    res.json({ success: true, passport: { summary, stamps, badges } });
  } catch (err) {
    next(err);
  }
});

export default router;
