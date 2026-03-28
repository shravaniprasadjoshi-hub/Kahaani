// src/services/translateAPI.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function authFetch(endpoint, options = {}) {
  const { getAuth } = await import("firebase/auth");
  const auth = getAuth();
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Translation failed");
  return data;
}

// ─── Translate text to a target Indian language ───────────────────────────
export async function translateText(text, targetLanguage, sourceLanguage = "auto") {
  return authFetch("/translate/text", {
    method: "POST",
    body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
  });
}

// ─── Transcribe voice recording ───────────────────────────────────────────
export async function speechToText(audioBase64, languageCode = "hi-IN") {
  return authFetch("/translate/speech-to-text", {
    method: "POST",
    body: JSON.stringify({ audioBase64, languageCode }),
  });
}

// ─── Narrate text in Indian language (TTS) ────────────────────────────────
export async function textToSpeech(text, languageCode = "hi-IN") {
  return authFetch("/translate/text-to-speech", {
    method: "POST",
    body: JSON.stringify({ text, languageCode }),
  });
}

// ─── Detect language of text ──────────────────────────────────────────────
export async function detectLanguage(text) {
  return authFetch("/translate/detect", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// ─── Get supported languages ──────────────────────────────────────────────
export async function getSupportedLanguages() {
  const res = await fetch(`${API_BASE}/translate/languages`);
  return res.json();
}
