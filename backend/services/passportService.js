import { db } from "../config/firebase.js";
import { generateStampDescription } from "./claudeService.js";

// ─── Stamp definitions ─────────────────────────────────────────────────────
// Each unique art form earns a different stamp
const STAMP_METADATA = {
  Madhubani: {
    icon: "🌸",
    color: "#E63946",
    title: "Mithila Guardian",
    state: "Bihar",
  },
  Warli: {
    icon: "🌿",
    color: "#2D6A4F",
    title: "Forest Witness",
    state: "Maharashtra",
  },
  Gond: {
    icon: "🦚",
    color: "#6A0572",
    title: "Gondwana Keeper",
    state: "Madhya Pradesh",
  },
  Pattachitra: {
    icon: "🪷",
    color: "#D4A017",
    title: "Jagannath Devotee",
    state: "Odisha",
  },
  Kalamkari: {
    icon: "🖌️",
    color: "#8B5E3C",
    title: "Pen & Flame Bearer",
    state: "Andhra Pradesh",
  },
  Phulkari: {
    icon: "🌻",
    color: "#F4A261",
    title: "Bloom Weaver",
    state: "Punjab",
  },
  Chikankari: {
    icon: "🕊️",
    color: "#E9C46A",
    title: "Shadow Needle",
    state: "Uttar Pradesh",
  },
  "Kantha embroidery": {
    icon: "🧵",
    color: "#457B9D",
    title: "Thread Memory",
    state: "West Bengal",
  },
  Ikat: {
    icon: "🌊",
    color: "#1D3557",
    title: "Resist Weaver",
    state: "Telangana",
  },
  Bastar: {
    icon: "🦁",
    color: "#6D4C41",
    title: "Forest Iron",
    state: "Chhattisgarh",
  },
  Tanjore: {
    icon: "🏛️",
    color: "#C9A84C",
    title: "Gold Devotee",
    state: "Tamil Nadu",
  },
  default: { icon: "🎨", color: "#264653", title: "Heritage Keeper", state: "India" },
};

// ─── Award stamp when purchase is confirmed ───────────────────────────────────
export async function awardStamp({ buyerUid, artworkId, artForm, state, artworkTitle }) {
  const passportRef = db.collection("cultural_passports").doc(buyerUid);
  const stampsRef = passportRef.collection("stamps");

  // Check if buyer already has this art form stamp
  const existing = await stampsRef.where("artForm", "==", artForm).limit(1).get();

  const stampMeta = STAMP_METADATA[artForm] || STAMP_METADATA.default;

  // Generate AI stamp description
  let stampDescription = `A rare ${artForm} piece from ${state}, now part of your heritage journey.`;
  try {
    stampDescription = await generateStampDescription({ artForm, state, artworkTitle });
  } catch {
    // Use fallback description
  }

  const newStamp = {
    artForm,
    state,
    artworkId,
    artworkTitle,
    ...stampMeta,
    description: stampDescription,
    earnedAt: new Date().toISOString(),
    isFirstOfKind: existing.empty, // True if this is buyer's first stamp of this art form
  };

  // Add the stamp
  await stampsRef.add(newStamp);

  // Update passport summary
  const passportSnap = await passportRef.get();
  const passport = passportSnap.exists ? passportSnap.data() : { totalStamps: 0, artForms: [], states: [] };

  const updatedPassport = {
    totalStamps: (passport.totalStamps || 0) + 1,
    artForms: [...new Set([...(passport.artForms || []), artForm])],
    states: [...new Set([...(passport.states || []), state])],
    lastUpdated: new Date().toISOString(),
  };

  await passportRef.set(updatedPassport, { merge: true });

  // Check for milestone badges
  const badges = await checkMilestoneBadges(updatedPassport, buyerUid);

  return { stamp: newStamp, badges };
}

// ─── Get buyer's full passport ────────────────────────────────────────────────
export async function getPassport(buyerUid) {
  const passportRef = db.collection("cultural_passports").doc(buyerUid);
  const stampsSnap = await passportRef.collection("stamps").orderBy("earnedAt", "desc").get();

  const stamps = stampsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const passportSnap = await passportRef.get();
  const summary = passportSnap.exists ? passportSnap.data() : {};

  const badgesSnap = await passportRef.collection("badges").get();
  const badges = badgesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return { summary, stamps, badges };
}

// ─── Milestone badges ─────────────────────────────────────────────────────────
async function checkMilestoneBadges(passport, buyerUid) {
  const { totalStamps, artForms, states } = passport;
  const badgesRef = db.collection("cultural_passports").doc(buyerUid).collection("badges");
  const earned = [];

  const milestones = [
    {
      id: "first_step",
      condition: totalStamps === 1,
      title: "First Step",
      description: "You've begun your cultural journey",
      icon: "🌱",
    },
    {
      id: "explorer",
      condition: totalStamps >= 5,
      title: "Cultural Explorer",
      description: "5 art forms discovered",
      icon: "🗺️",
    },
    {
      id: "patron",
      condition: totalStamps >= 10,
      title: "Heritage Patron",
      description: "10 artworks supported",
      icon: "🏺",
    },
    {
      id: "multi_state",
      condition: states?.length >= 3,
      title: "Many Bharat",
      description: "Collected from 3 different states",
      icon: "🇮🇳",
    },
    {
      id: "rare_collector",
      condition: artForms?.length >= 5,
      title: "Rare Collector",
      description: "5 distinct art traditions preserved",
      icon: "💎",
    },
  ];

  for (const milestone of milestones) {
    if (milestone.condition) {
      const exists = await badgesRef.doc(milestone.id).get();
      if (!exists.exists) {
        await badgesRef.doc(milestone.id).set({
          ...milestone,
          earnedAt: new Date().toISOString(),
        });
        earned.push(milestone);
      }
    }
  }

  return earned;
}
