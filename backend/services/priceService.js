// ─── Fair Price Calculator ────────────────────────────────────────────────────
// Based on: rarity, time, materials, regional cost of living, art form complexity

const RARITY_MULTIPLIERS = {
  common: 1.0,
  uncommon: 1.4,
  rare: 1.9,
  critically_endangered: 2.8,
};

// Base hourly rate by state (INR) — reflects local living wage
const STATE_HOURLY_RATES = {
  "Madhya Pradesh": 85,
  Jharkhand: 80,
  Odisha: 80,
  Chhattisgarh: 75,
  Rajasthan: 90,
  Gujarat: 100,
  "West Bengal": 85,
  "Andhra Pradesh": 90,
  Telangana: 95,
  Maharashtra: 110,
  "Uttar Pradesh": 80,
  Bihar: 75,
  "Himachal Pradesh": 95,
  Uttarakhand: 90,
  default: 85,
};

// Art form complexity multiplier
const ART_FORM_COMPLEXITY = {
  Madhubani: 1.3,
  Warli: 1.1,
  Gond: 1.3,
  Pattachitra: 1.5,
  Kalamkari: 1.4,
  Phulkari: 1.6,
  Chikankari: 1.7,
  "Kantha embroidery": 1.5,
  "Banjara embroidery": 1.4,
  Ikat: 1.6,
  Bastar: 1.3,
  Dhokra: 1.4,
  Bidriware: 1.5,
  Papier: 1.2,
  Tanjore: 1.6,
  default: 1.2,
};

// Common material costs (INR)
const MATERIAL_COSTS = {
  "natural dyes": 120,
  "mineral colors": 200,
  "handmade paper": 80,
  canvas: 150,
  silk: 500,
  cotton: 150,
  "bamboo pen": 30,
  "cow dung primer": 20,
  "gum arabic": 60,
  "gold leaf": 400,
  "silver leaf": 300,
  clay: 40,
  "brass wire": 180,
  beads: 200,
  mirrors: 150,
  default: 100,
};

export function calculateFairPrice({
  artForm,
  state,
  rarity = "uncommon",
  timeSpentHours = 10,
  materials = [],
  dimensionsCm = null, // { width, height }
  isCustomCommission = false,
}) {
  // 1. Base hourly rate for region
  const hourlyRate = STATE_HOURLY_RATES[state] || STATE_HOURLY_RATES.default;

  // 2. Labour cost
  const labourCost = hourlyRate * timeSpentHours;

  // 3. Material cost
  const materialCost = materials.reduce((total, mat) => {
    const cost = MATERIAL_COSTS[mat.toLowerCase()] || MATERIAL_COSTS.default;
    return total + cost;
  }, 0);

  // 4. Size premium (if dimensions provided)
  let sizePremium = 0;
  if (dimensionsCm) {
    const area = dimensionsCm.width * dimensionsCm.height;
    sizePremium = Math.floor(area / 100) * 15; // ₹15 per 100 sq cm
  }

  // 5. Apply rarity multiplier
  const rarityMultiplier = RARITY_MULTIPLIERS[rarity] || 1.0;

  // 6. Apply art form complexity
  const complexityMultiplier =
    ART_FORM_COMPLEXITY[artForm] || ART_FORM_COMPLEXITY.default;

  // 7. Commission premium
  const commissionPremium = isCustomCommission ? 1.25 : 1.0;

  // 8. Platform sustainability (5% — goes to Kahaani)
  const platformFee = 0.05;

  // ─── Calculate ───────────────────────────────────────────────────────────
  const basePrice =
    (labourCost + materialCost + sizePremium) *
    rarityMultiplier *
    complexityMultiplier *
    commissionPremium;

  const artistEarnings = Math.ceil(basePrice / 50) * 50; // Round to nearest ₹50
  const platformAmount = Math.ceil(artistEarnings * platformFee);
  const buyerTotal = artistEarnings + platformAmount;

  // Minimum floor price
  const finalArtistEarnings = Math.max(artistEarnings, 300);
  const finalTotal = Math.max(buyerTotal, 320);

  return {
    suggestedPrice: finalTotal,
    artistEarnings: finalArtistEarnings,
    platformFee: platformAmount,
    breakdown: {
      labourCost,
      materialCost,
      sizePremium,
      rarityMultiplier,
      complexityMultiplier,
      commissionPremium,
    },
    priceRange: {
      minimum: Math.max(Math.floor(finalTotal * 0.85 / 50) * 50, 300),
      recommended: finalTotal,
      premium: Math.ceil(finalTotal * 1.2 / 50) * 50,
    },
    currency: "INR",
  };
}

// ─── Price transparency message for buyer ────────────────────────────────────
export function getPriceTransparency(priceData) {
  const { artistEarnings, platformFee, suggestedPrice } = priceData;
  const artistPercent = Math.round((artistEarnings / suggestedPrice) * 100);

  return {
    message: `₹${artistEarnings} goes directly to the artist's UPI account. Kahaani retains ₹${platformFee} (${100 - artistPercent}%) to sustain the platform.`,
    artistPercent,
    platformPercent: 100 - artistPercent,
  };
}
