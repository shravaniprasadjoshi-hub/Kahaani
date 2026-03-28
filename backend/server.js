import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import storyRoutes from "./routes/story.js";
import artworkRoutes from "./routes/artwork.js";
import artistRoutes from "./routes/artist.js";
import buyerRoutes from "./routes/buyer.js";
import uploadRoutes from "./routes/upload.js";
import priceRoutes from "./routes/price.js";
import passportRoutes from "./routes/passport.js";
import translateRoutes from "./routes/translate.js";
import paymentRoutes from "./routes/payment.js";
import artFormsRoutes from "./routes/artForms.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Global Rate Limiter ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// ─── AI Route Limiter (Claude API calls) ────────────────────────────────────
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "AI rate limit reached. Please wait a moment." },
});

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/story", aiLimiter, storyRoutes);
app.use("/api/artwork", artworkRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/passport", passportRoutes);
app.use("/api/translate", aiLimiter, translateRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/art-forms", artFormsRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Kahaani API",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🎨 Kahaani API running on http://localhost:${PORT}`);
});

export default app;
