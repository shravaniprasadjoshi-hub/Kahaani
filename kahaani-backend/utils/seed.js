// utils/seed.js
// Run once: node utils/seed.js
// Seeds Firestore with Indian art forms reference data


import 'dotenv/config';
import { db } from "../config/firebase.js";

const ART_FORMS = [
  {
    id: "madhubani",
    name: "Madhubani",
    state: "Bihar",
    region: "Mithila",
    rarity: "uncommon",
    estimatedAge: "2500+ years",
    description:
      "Originated in the Mithila region of Bihar, Madhubani paintings use natural pigments on handmade paper or cloth. Themes include mythology, nature, and social occasions.",
    materials: ["natural dyes", "handmade paper", "bamboo pen", "cow dung primer"],
    unescoListed: true,
    giTagged: true,
    practitionersEstimate: "~25,000",
    endangermentReason: null,
    dominantColors: ["#E63946", "#F4A261", "#264653", "#2A9D8F"],
    icon: "🌸",
  },
  {
    id: "warli",
    name: "Warli",
    state: "Maharashtra",
    region: "Palghar district (tribal)",
    rarity: "uncommon",
    estimatedAge: "2500+ years",
    description:
      "Warli is a tribal art form by the Warli people of Maharashtra, using geometric patterns — mainly circles, triangles, and squares — to depict scenes of daily life.",
    materials: ["rice paste", "bamboo stick", "cow dung mud wall"],
    unescoListed: false,
    giTagged: false,
    practitionersEstimate: "~10,000",
    endangermentReason: "Urbanisation of tribal lands",
    dominantColors: ["#FFFFFF", "#8B5E3C", "#D4A017"],
    icon: "🌿",
  },
  {
    id: "gond",
    name: "Gond",
    state: "Madhya Pradesh",
    region: "Bastar, Mandla, Dindori",
    rarity: "rare",
    estimatedAge: "1400+ years",
    description:
      "Gond paintings by the Gondi tribal people celebrate nature — animals, birds, trees — through intricate dot and line patterns. Each creature is filled with flowing forms.",
    materials: ["mineral colors", "natural dyes", "canvas", "handmade paper"],
    unescoListed: false,
    giTagged: false,
    practitionersEstimate: "~5,000",
    endangermentReason: "Young generation migration to cities",
    dominantColors: ["#6A0572", "#F4D03F", "#E74C3C", "#1ABC9C"],
    icon: "🦚",
  },
  {
    id: "pattachitra",
    name: "Pattachitra",
    state: "Odisha",
    region: "Puri, Raghurajpur",
    rarity: "rare",
    estimatedAge: "1000+ years",
    description:
      "Pattachitra ('patta' = cloth, 'chitra' = picture) is a cloth-based scroll painting from Odisha, depicting stories from Hindu mythology with bold borders and intricate detail.",
    materials: ["natural dyes", "gold leaf", "tamarind seed paste", "cloth"],
    unescoListed: false,
    giTagged: true,
    practitionersEstimate: "~3,000",
    endangermentReason: "Very few hereditary artisan families remain",
    dominantColors: ["#D4A017", "#8B0000", "#1A1A1A", "#FFFFFF"],
    icon: "🪷",
  },
  {
    id: "kalamkari",
    name: "Kalamkari",
    state: "Andhra Pradesh",
    region: "Srikalahasti, Machilipatnam",
    rarity: "rare",
    estimatedAge: "3000+ years",
    description:
      "Kalamkari means 'work of the pen' — a hand-painted or block-printed textile art using natural dyes on cotton or silk. Two distinct styles: Srikalahasti (hand-painted) and Machilipatnam (block-printed).",
    materials: ["natural dyes", "cotton", "silk", "bamboo pen", "iron mordant"],
    unescoListed: false,
    giTagged: true,
    practitionersEstimate: "~2,500",
    endangermentReason: "Chemical dye competition",
    dominantColors: ["#8B5E3C", "#E74C3C", "#1A6B3C", "#F4D03F"],
    icon: "🖌️",
  },
  {
    id: "phulkari",
    name: "Phulkari",
    state: "Punjab",
    region: "Entire Punjab",
    rarity: "uncommon",
    estimatedAge: "500+ years",
    description:
      "Phulkari ('flower work') is a traditional embroidery from Punjab, done on hand-spun khaddar cloth with silk floss thread. Originally made for wedding trousseaux.",
    materials: ["khaddar cloth", "silk floss", "natural dyes"],
    unescoListed: false,
    giTagged: true,
    practitionersEstimate: "~15,000",
    endangermentReason: null,
    dominantColors: ["#F4A261", "#E63946", "#2A9D8F", "#E9C46A"],
    icon: "🌻",
  },
  {
    id: "chikankari",
    name: "Chikankari",
    state: "Uttar Pradesh",
    region: "Lucknow",
    rarity: "uncommon",
    estimatedAge: "400+ years",
    description:
      "Chikankari is a delicate and intricate style of hand-embroidery on light fabrics, traditionally white on white. Lucknow is its epicentre, said to have been introduced by Mughal Empress Noor Jahan.",
    materials: ["cotton muslin", "silk", "white thread", "chiffon"],
    unescoListed: false,
    giTagged: true,
    practitionersEstimate: "~250,000 (mostly women)",
    endangermentReason: null,
    dominantColors: ["#FFFFFF", "#F5F5DC", "#E8E8E8"],
    icon: "🕊️",
  },
  {
    id: "kantha",
    name: "Kantha embroidery",
    state: "West Bengal",
    region: "Rural Bengal, Bangladesh",
    rarity: "uncommon",
    estimatedAge: "500+ years",
    description:
      "Kantha is a running-stitch embroidery tradition from Bengal, originally made by recycling old saris into quilts. The stitches create rippling patterns that look like waves.",
    materials: ["recycled saris", "cotton thread", "silk"],
    unescoListed: false,
    giTagged: false,
    practitionersEstimate: "~50,000",
    endangermentReason: null,
    dominantColors: ["#457B9D", "#E63946", "#F4D03F", "#2A9D8F"],
    icon: "🧵",
  },
  {
    id: "banjara",
    name: "Banjara embroidery",
    state: "Telangana",
    region: "Nizamabad, Adilabad",
    rarity: "critically_endangered",
    estimatedAge: "600+ years",
    description:
      "Banjara embroidery is practised by the nomadic Banjara tribe, using bright colours, mirrors, beads, and geometric patterns. Each design carries tribal identity markers.",
    materials: ["cotton", "mirrors", "beads", "silk thread", "cowrie shells"],
    unescoListed: false,
    giTagged: false,
    practitionersEstimate: "< 500",
    endangermentReason: "Nomadic tribe settling; tradition not passed to new generation",
    dominantColors: ["#E74C3C", "#F4D03F", "#8B008B", "#1ABC9C"],
    icon: "🔮",
  },
  {
    id: "dhokra",
    name: "Dhokra",
    state: "Chhattisgarh",
    region: "Bastar",
    rarity: "critically_endangered",
    estimatedAge: "4000+ years",
    description:
      "Dhokra is a non-ferrous metal casting technique using the lost-wax method — one of the oldest known metal casting techniques in the world. The famous Dancing Girl of Mohenjo-daro is a Dhokra ancestor.",
    materials: ["brass wire", "beeswax", "clay", "cow dung"],
    unescoListed: false,
    giTagged: false,
    practitionersEstimate: "< 300 families",
    endangermentReason: "Extremely labour intensive; no young artisans learning the craft",
    dominantColors: ["#B8860B", "#8B4513", "#D2691E"],
    icon: "⚱️",
  },
  {
    id: "ikat",
    name: "Ikat",
    state: "Telangana",
    region: "Pochampally, Nalgonda",
    rarity: "rare",
    estimatedAge: "200+ years (in India)",
    description:
      "Pochampally Ikat is a resist-dyeing weave technique where threads are dyed before weaving, creating blurred, geometric patterns. A UNESCO-recognized Geographical Indication.",
    materials: ["cotton", "silk", "natural dyes", "handloom"],
    unescoListed: true,
    giTagged: true,
    practitionersEstimate: "~10,000 weavers",
    endangermentReason: "Power looms undercutting handloom prices",
    dominantColors: ["#1D3557", "#E63946", "#F4D03F", "#2A9D8F"],
    icon: "🌊",
  },
  {
    id: "tanjore",
    name: "Tanjore",
    state: "Tamil Nadu",
    region: "Thanjavur",
    rarity: "rare",
    estimatedAge: "1000+ years",
    description:
      "Tanjore paintings are devotional panel paintings with rich, vivid colours, compact composition, and surface richness due to gold foil overlaid on glass or wood, depicting Hindu deities.",
    materials: ["gold leaf", "semi-precious stones", "glass", "natural dyes"],
    unescoListed: false,
    giTagged: true,
    practitionersEstimate: "~2,000",
    endangermentReason: "Gold material costs rising; dwindling patronage",
    dominantColors: ["#C9A84C", "#8B0000", "#1A1A1A", "#FFFFFF"],
    icon: "🏛️",
  },
];

async function seed() {
  console.log("🌱 Seeding Kahaani database...");

  const batch = db.batch();

  for (const artForm of ART_FORMS) {
    const ref = db.collection("art_forms").doc(artForm.id);
    batch.set(ref, { ...artForm, seededAt: new Date().toISOString() });
  }

  await batch.commit();
  console.log(`✅ Seeded ${ART_FORMS.length} art forms successfully`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
