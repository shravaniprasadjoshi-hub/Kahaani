import express from "express";
import crypto from "crypto";
import { authenticate } from "../middleware/auth.js";
import { db } from "../config/firebase.js";
import { awardStamp } from "../services/passportService.js";

const router = express.Router();

// Lazy-load Razorpay to avoid crash if key not set
async function getRazorpay() {
  const { default: Razorpay } = await import("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// ─── POST /api/payment/create-order ──────────────────────────────────────
// Step 1: Create Razorpay order before payment
router.post("/create-order", authenticate, async (req, res, next) => {
  try {
    const { artworkId, isCommission, commissionId } = req.body;

    if (!artworkId) return res.status(400).json({ error: "artworkId is required" });

    // Get artwork details
    const artworkSnap = await db.collection("artworks").doc(artworkId).get();
    if (!artworkSnap.exists) return res.status(404).json({ error: "Artwork not found" });

    const artwork = artworkSnap.data();

    if (artwork.status !== "listed") {
      return res.status(400).json({ error: "This artwork is not available for purchase" });
    }
    if (!artwork.price) {
      return res.status(400).json({ error: "Artwork has no price set" });
    }

    const razorpay = await getRazorpay();

    const order = await razorpay.orders.create({
      amount: artwork.price * 100, // paise
      currency: "INR",
      receipt: `kahaani_${artworkId}_${Date.now()}`,
      notes: {
        artworkId,
        artworkTitle: artwork.title,
        artistId: artwork.artistId,
        buyerId: req.user.uid,
      },
    });

    // Save pending order to Firestore
    const pendingOrder = {
      razorpayOrderId: order.id,
      artworkId,
      artworkTitle: artwork.title,
      artworkImageUrl: artwork.thumbnailUrl || artwork.imageUrl,
      artistId: artwork.artistId,
      artistName: artwork.artistName,
      buyerId: req.user.uid,
      artForm: artwork.artForm,
      state: artwork.state,
      amount: artwork.price,
      artistEarnings: artwork.artistEarnings,
      platformFee: artwork.price - (artwork.artistEarnings || 0),
      status: "pending",
      isCommission: isCommission || false,
      commissionId: commissionId || null,
      createdAt: new Date().toISOString(),
    };

    await db.collection("orders").add(pendingOrder);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      artwork: {
        title: artwork.title,
        artistName: artwork.artistName,
        price: artwork.price,
        artistEarnings: artwork.artistEarnings,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/payment/verify ─────────────────────────────────────────────
// Step 2: Verify payment signature after Razorpay callback
router.post("/verify", authenticate, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    // Verify HMAC signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed — invalid signature" });
    }

    // Find the pending order
    const ordersSnap = await db
      .collection("orders")
      .where("razorpayOrderId", "==", razorpay_order_id)
      .limit(1)
      .get();

    if (ordersSnap.empty) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderDoc = ordersSnap.docs[0];
    const order = orderDoc.data();

    // Mark order as completed
    await orderDoc.ref.update({
      status: "completed",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      completedAt: new Date().toISOString(),
    });

    // Mark artwork as sold (if not a commission, mark as sold)
    if (!order.isCommission) {
      await db.collection("artworks").doc(order.artworkId).update({
        status: "sold",
        soldAt: new Date().toISOString(),
        soldTo: req.user.uid,
      });
    }

    // Update artist stats
    await db.collection("artists").doc(order.artistId).update({
      totalSales: (await db.collection("artists").doc(order.artistId).get()).data()?.totalSales + 1 || 1,
      totalEarnings: (await db.collection("artists").doc(order.artistId).get()).data()?.totalEarnings + order.artistEarnings || order.artistEarnings,
    });

    // Update buyer stats
    await db.collection("buyers").doc(req.user.uid).set(
      {
        totalPurchases: ((await db.collection("buyers").doc(req.user.uid).get()).data()?.totalPurchases || 0) + 1,
        totalSpent: ((await db.collection("buyers").doc(req.user.uid).get()).data()?.totalSpent || 0) + order.amount,
      },
      { merge: true }
    );

    // 🏅 Award cultural passport stamp
    let stampResult = null;
    try {
      stampResult = await awardStamp({
        buyerUid: req.user.uid,
        artworkId: order.artworkId,
        artForm: order.artForm,
        state: order.state,
        artworkTitle: order.artworkTitle,
      });
    } catch (e) {
      console.warn("[Passport stamp error]", e.message);
    }

    // TODO: Trigger UPI payout to artist (Razorpay Payouts API)
    // This requires Razorpay business account with Payouts enabled
    // await triggerArtistPayout(order);

    res.json({
      success: true,
      message: "Payment verified. Thank you for supporting Indian heritage.",
      orderId: orderDoc.id,
      stamp: stampResult?.stamp || null,
      badges: stampResult?.badges || [],
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/payment/webhook ────────────────────────────────────────────
// Razorpay webhook (server-to-server confirmation)
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body;

    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSig !== signature) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = JSON.parse(body.toString());

    if (event.event === "payment.captured") {
      console.log("[Webhook] Payment captured:", event.payload.payment.entity.id);
      // Additional server-side confirmation logic here
    }

    if (event.event === "payment.failed") {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.order_id;

      // Mark order as failed
      const snap = await db
        .collection("orders")
        .where("razorpayOrderId", "==", orderId)
        .limit(1)
        .get();

      if (!snap.empty) {
        await snap.docs[0].ref.update({
          status: "failed",
          failedAt: new Date().toISOString(),
          failReason: event.payload.payment.entity.error_description,
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[Webhook Error]", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// ─── GET /api/payment/order/:orderId ─────────────────────────────────────
router.get("/order/:orderId", authenticate, async (req, res, next) => {
  try {
    const snap = await db.collection("orders").doc(req.params.orderId).get();
    if (!snap.exists) return res.status(404).json({ error: "Order not found" });

    const order = snap.data();
    if (order.buyerId !== req.user.uid && order.artistId !== req.user.uid) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ success: true, order: { id: snap.id, ...order } });
  } catch (err) {
    next(err);
  }
});

export default router;
