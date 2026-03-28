// src/services/claudeAPI.js
// All Claude AI-powered calls go through the backend to protect API keys

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
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─── Generate Story Card ──────────────────────────────────────────────────
export async function generateStoryCard({ transcript, artForm, state, imageUrl }) {
  return authFetch("/story/generate", {
    method: "POST",
    body: JSON.stringify({ transcript, artForm, state, imageUrl }),
  });
}

// ─── Analyse Artwork Image ────────────────────────────────────────────────
export async function analyseArtworkImage(imageUrl) {
  return authFetch("/story/analyse-image", {
    method: "POST",
    body: JSON.stringify({ imageUrl }),
  });
}

// ─── Get AI Price Rationale ───────────────────────────────────────────────
export async function getPriceRationale(params) {
  return authFetch("/story/price-rationale", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
