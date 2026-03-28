import { auth } from "../config/firebase.js";

// ─── Verify Firebase ID Token ────────────────────────────────────────────────
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No auth token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // { uid, email, name, ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ─── Optional Auth (doesn't block if no token) ──────────────────────────────
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    req.user = await auth.verifyIdToken(token);
  } catch {
    req.user = null;
  }
  next();
}

// ─── Role check: Artist only ─────────────────────────────────────────────────
export function requireArtist(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  if (req.user.role !== "artist") {
    return res.status(403).json({ error: "Artist access only" });
  }
  next();
}

// ─── Role check: Buyer only ──────────────────────────────────────────────────
export function requireBuyer(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  if (req.user.role !== "buyer") {
    return res.status(403).json({ error: "Buyer access only" });
  }
  next();
}
