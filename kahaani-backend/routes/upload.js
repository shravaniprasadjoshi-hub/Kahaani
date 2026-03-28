import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  uploadArtwork,
  uploadProfile,
  uploadAudio,
  restoreArtworkImage,
} from "../config/cloudinary.js";

const router = express.Router();

// ─── POST /api/upload/artwork ─────────────────────────────────────────────
// Upload artwork image to Cloudinary
router.post(
  "/artwork",
  authenticate,
  uploadArtwork.single("image"),
  (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No image file provided" });

      res.json({
        success: true,
        imageUrl: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/upload/profile ─────────────────────────────────────────────
// Upload artist profile picture
router.post(
  "/profile",
  authenticate,
  uploadProfile.single("image"),
  (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No image file provided" });

      res.json({
        success: true,
        imageUrl: req.file.path,
        publicId: req.file.filename,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/upload/audio ───────────────────────────────────────────────
// Upload voice recording
router.post(
  "/audio",
  authenticate,
  uploadAudio.single("audio"),
  (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No audio file provided" });

      res.json({
        success: true,
        audioUrl: req.file.path,
        publicId: req.file.filename,
        duration: req.file.duration || null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/upload/restore ─────────────────────────────────────────────
// AI image restoration (before/after)
router.post("/restore", authenticate, async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ error: "publicId is required" });

    const { original, restored } = await restoreArtworkImage(publicId);

    res.json({ success: true, original, restored });
  } catch (err) {
    next(err);
  }
});

// ─── Error handler for multer ─────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large" });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: "Unexpected file field" });
  }
  next(err);
});

export default router;
