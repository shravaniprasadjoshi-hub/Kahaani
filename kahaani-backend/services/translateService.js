import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SARVAM_BASE = "https://api.sarvam.ai";

// Language codes supported by Sarvam AI
export const SUPPORTED_LANGUAGES = {
  hi: "Hindi",
  bn: "Bengali",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  mr: "Marathi",
  or: "Odia",
  pa: "Punjabi",
  ta: "Tamil",
  te: "Telugu",
};

const sarvamHeaders = {
  "api-subscription-key": process.env.SARVAM_API_KEY,
  "Content-Type": "application/json",
};

// ─── Translate text ────────────────────────────────────────────────────────
export async function translateText({ text, sourceLanguage = "auto", targetLanguage }) {
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/translate`,
      {
        input: text,
        source_language_code: sourceLanguage === "auto" ? "en-IN" : `${sourceLanguage}-IN`,
        target_language_code: `${targetLanguage}-IN`,
        speaker_gender: "Female",
        mode: "formal",
        model: "mayura:v1",
        enable_preprocessing: true,
      },
      { headers: sarvamHeaders }
    );

    return {
      translatedText: response.data.translated_text,
      sourceLanguage: response.data.source_language_code,
      targetLanguage: response.data.target_language_code,
    };
  } catch (err) {
    console.error("[Sarvam Translate Error]", err?.response?.data || err.message);
    throw new Error("Translation service unavailable");
  }
}

// ─── Transliterate (script convert) ──────────────────────────────────────────
export async function transliterate({ text, sourceLanguage, targetLanguage = "hi" }) {
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/transliterate`,
      {
        input: text,
        source_language_code: `${sourceLanguage}-IN`,
        target_language_code: `${targetLanguage}-IN`,
        numerals_format: "native",
      },
      { headers: sarvamHeaders }
    );

    return response.data.transliterated_text;
  } catch (err) {
    console.error("[Sarvam Transliterate Error]", err?.response?.data || err.message);
    throw new Error("Transliteration service unavailable");
  }
}

// ─── Speech to Text (for voice recordings) ───────────────────────────────────
export async function speechToText({ audioBase64, languageCode = "hi-IN" }) {
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/speech-to-text`,
      {
        model: "saarika:v2",
        language_code: languageCode,
        audio: audioBase64, // base64 encoded audio
        with_timestamps: false,
      },
      { headers: sarvamHeaders }
    );

    return {
      transcript: response.data.transcript,
      language: response.data.language_code,
    };
  } catch (err) {
    console.error("[Sarvam STT Error]", err?.response?.data || err.message);
    throw new Error("Speech-to-text service unavailable");
  }
}

// ─── Text to Speech (for story card narration) ───────────────────────────────
export async function textToSpeech({ text, languageCode = "hi-IN", speakerName = "anushka" }) {
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/text-to-speech`,
      {
        inputs: [text],
        target_language_code: languageCode,
        speaker: speakerName,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v1",
      },
      { headers: sarvamHeaders }
    );

    // Returns base64 audio
    return response.data.audios[0];
  } catch (err) {
    console.error("[Sarvam TTS Error]", err?.response?.data || err.message);
    throw new Error("Text-to-speech service unavailable");
  }
}

// ─── Detect language from text ────────────────────────────────────────────────
export async function detectLanguage(text) {
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/text-lid`,
      { input: text },
      { headers: sarvamHeaders }
    );
    return response.data.language_code; // e.g. "hi-IN"
  } catch (err) {
    console.warn("[Language detection failed, defaulting to hi-IN]");
    return "hi-IN";
  }
}
