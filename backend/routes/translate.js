import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  translateText,
  speechToText,
  textToSpeech,
  detectLanguage,
  SUPPORTED_LANGUAGES,
} from "../services/translateService.js";

const router = express.Router();

// ─── GET /api/translate/languages ────────────────────────────────────────
router.get("/languages", (req, res) => {
  res.json({ success: true, languages: SUPPORTED_LANGUAGES });
});

// ─── POST /api/translate/text ─────────────────────────────────────────────
router.post("/text", authenticate, async (req, res, next) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    if (!SUPPORTED_LANGUAGES[targetLanguage]) {
      return res.status(400).json({
        error: `Unsupported language. Supported: ${Object.keys(SUPPORTED_LANGUAGES).join(", ")}`,
      });
    }

    const result = await translateText({ text, sourceLanguage, targetLanguage });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/translate/speech-to-text ──────────────────────────────────
// Transcribe artist voice recording
router.post("/speech-to-text", authenticate, async (req, res, next) => {
  try {
    const { audioBase64, languageCode } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    const result = await speechToText({ audioBase64, languageCode: languageCode || "hi-IN" });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/translate/text-to-speech ──────────────────────────────────
// Narrate story card in target language
router.post("/text-to-speech", authenticate, async (req, res, next) => {
  try {
    const { text, languageCode, speakerName } = req.body;

    if (!text) return res.status(400).json({ error: "text is required" });

    const audioBase64 = await textToSpeech({
      text,
      languageCode: languageCode || "hi-IN",
      speakerName: speakerName || "anushka",
    });

    res.json({ success: true, audioBase64, format: "wav" });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/translate/detect ──────────────────────────────────────────
router.post("/detect", authenticate, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const languageCode = await detectLanguage(text);
    res.json({ success: true, languageCode });
  } catch (err) {
    next(err);
  }
});

export default router;
