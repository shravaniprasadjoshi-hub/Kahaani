import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const STORY_SYSTEM_PROMPT = `You are Kahaani's cultural narrator — a poet, historian, and storyteller deeply versed in Indian art traditions. 
Your role is to transform an artist's spoken words about her artwork into a beautifully crafted bilingual story card.

You will receive:
- The artist's voice transcript (possibly in a regional Indian language, transliterated, or in broken English)
- The art form name
- The artist's state/region
- Any image description (if provided)

You must return a JSON object with this EXACT structure:
{
  "title": "Evocative English title for the artwork (5-8 words)",
  "titleHindi": "Hindi title (देवनागरी script)",
  "storyEnglish": "A 3-4 sentence poetic story in English — vivid, respectful, culturally rooted. Mention the art form, region, materials if known, and what makes this piece unique.",
  "storyHindi": "Same story in Hindi (देवनागरी) — natural, not literal translation. Should feel like it was originally written in Hindi.",
  "artistVoiceQuote": "The single most beautiful/meaningful sentence from the artist's own words (translated to English if needed). Max 20 words.",
  "heritageTag": "One heritage phrase e.g. '500-year-old Gond tradition' or 'Endangered Madhubani technique'",
  "culturalLineage": ["tag1", "tag2", "tag3"],
  "materialsUsed": ["material1", "material2"],
  "technique": "Short description of the technique used",
  "symbolismHighlight": "One meaningful symbol or motif explained (1-2 sentences)",
  "rarity": "common | uncommon | rare | critically_endangered",
  "rarityReason": "One sentence explaining why this art form is rated as it is",
  "estimatedAgeOfTradition": "e.g. '600+ years'",
  "mood": ["peaceful", "vibrant"] // 1-3 mood tags
}

Rules:
- NEVER fabricate specific details the artist didn't mention. If unsure, use culturally accurate generalities.
- The English story must be lyrical but grounded — avoid generic phrases like "beautiful artwork" or "talented artist".
- If the transcript is in a regional language, translate faithfully first, then craft the story.
- Always honour the artist's voice — her perspective should feel primary, not secondary.
- Return ONLY the JSON object. No markdown, no preamble, no explanation.`;

// ─── Generate Story Card ──────────────────────────────────────────────────────
export async function generateStoryCard({
  transcript,
  artForm,
  state,
  imageDescription = null,
}) {
  const userContent = `
Artist's spoken words / transcript:
"${transcript}"

Art Form: ${artForm}
State/Region: ${state}
${imageDescription ? `Image description: ${imageDescription}` : ""}

Please generate the story card JSON now.
`.trim();

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1500,
    system: STORY_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const raw = response.content[0].text.trim();

  // Strip markdown fences if present
  const jsonStr = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

  const storyCard = JSON.parse(jsonStr);
  return storyCard;
}

// ─── Generate Fair Price Explanation ─────────────────────────────────────────
export async function generatePriceRationale({
  artForm,
  state,
  rarity,
  dimensions,
  timeSpentHours,
  materials,
  suggestedPrice,
}) {
  const prompt = `You are a fair trade pricing advisor for Indian folk art. 

Given this artwork:
- Art Form: ${artForm}
- State: ${state}
- Rarity: ${rarity}
- Dimensions: ${dimensions || "Not specified"}
- Artist's time: ${timeSpentHours || "Unknown"} hours
- Materials used: ${materials?.join(", ") || "Traditional materials"}
- Suggested price: ₹${suggestedPrice}

Write a SHORT (2-3 sentence) buyer-facing explanation of WHY this price is fair. 
Be specific, mention the art form's rarity, the artist's skill, and material/time costs.
Make the buyer feel good about paying this price — not guilty, but enlightened.
Return only the explanation text, no JSON.`;

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text.trim();
}

// ─── Analyse Artwork Image (vision) ──────────────────────────────────────────
export async function analyseArtworkImage(imageUrl) {
  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "url", url: imageUrl },
          },
          {
            type: "text",
            text: `Analyse this Indian folk/tribal artwork image.
Return a JSON object with:
{
  "dominantColors": ["color1", "color2", "color3"],
  "detectedMotifs": ["motif1", "motif2"],
  "estimatedArtForm": "your best guess of the art form",
  "composition": "brief description of composition (1 sentence)",
  "standoutElement": "the single most visually striking element",
  "imageDescription": "2-3 sentence description for story generation context"
}
Return ONLY JSON.`,
          },
        ],
      },
    ],
  });

  const raw = response.content[0].text.trim();
  const jsonStr = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(jsonStr);
}

// ─── Generate Cultural Passport Stamp Description ────────────────────────────
export async function generateStampDescription({ artForm, state, artworkTitle }) {
  const prompt = `Write a 1-sentence poetic stamp description for a cultural passport.
The buyer just purchased a "${artworkTitle}" — a ${artForm} artwork from ${state}.
Make it feel like they've earned a rare cultural credential. Max 15 words.
Return only the sentence.`;

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 60,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text.trim();
}
