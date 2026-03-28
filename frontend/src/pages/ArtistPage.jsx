import { useState } from 'react'
import Navbar from '../components/Navbar'
import Ticker from '../components/Ticker'
import VoiceRecorder from '../components/VoiceRecorder'
import ImageUploader from '../components/ImageUploader'
import ImageRestoration from '../components/ImageRestoration'
import StoryCard from '../components/StoryCard'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

// ── Prompt fed to Claude — uses the artist's raw voice transcript ────────────
function buildPrompt(transcript) {
  return `You are a cultural storytelling expert for Kahaani — a marketplace that connects India's women folk artists with buyers worldwide.

An artist has just spoken about her artwork in her native language. The speech may be in Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Punjabi, or any Indian language. It may be imperfect, fragmented, or mixed with English.

Here is exactly what the artist said (raw transcript):
"${transcript}"

Your job:
1. Understand the essence of what she is describing — the artwork, the technique, the emotion, the tradition.
2. Craft a CATCHY, POETIC, EMOTIONALLY RESONANT story card in English that will make an international buyer fall in love with this artwork.
3. The story must feel personal — like a letter from the artist to the buyer — not a product description.
4. Infer the art form, region, rarity, and a fair price based on the context.

Respond ONLY with a valid JSON object. No markdown, no backticks, no extra text:
{
  "artistName": "an authentic Indian woman's name that fits the region",
  "title": "a poetic, evocative title for this specific artwork (not generic)",
  "story": "2-3 sentences of beautiful, intimate storytelling — written as if the artist is speaking to the buyer personally. Include details about the technique, the lineage, the emotion. Make the buyer feel they are holding a piece of living history.",
  "artForm": "the specific art form (e.g. Warli Painting, Madhubani, Phulkari Embroidery, Gond Art, Toda Embroidery)",
  "region": "specific region of India (e.g. Palghar, Maharashtra)",
  "rarity": "one of: Endangered / Critical / Vulnerable / Stable",
  "suggestedPrice": a fair price as a number between 1500 and 25000 based on art form complexity,
  "tags": ["art form tag", "state/region tag", "rarity tag", "age/history tag"]
}`
}

// ── Fallback story if API call fails ────────────────────────────────────────
const FALLBACK_STORY = {
  artistName: 'Savitri Devi',
  title: 'Song of the Harvest Moon',
  story: 'These patterns were taught to me by my grandmother at the age of seven — her hands guiding mine through the sacred geometry of our ancestors. Every circle is the sun and moon, the giver of life. Every triangle is the mountain that protects us. I have painted these stories for forty years so they are never forgotten.',
  artForm: 'Warli Painting',
  region: 'Palghar, Maharashtra',
  rarity: 'Vulnerable',
  suggestedPrice: 4200,
  tags: ['Warli', 'Maharashtra', '🟡 Vulnerable', '2500 years old'],
}

export default function ArtistPage() {
  const [step, setStep]               = useState(1)
  const [image, setImage]             = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [transcript, setTranscript]   = useState('')
  const [storyCard, setStoryCard]     = useState(null)
  const [generating, setGenerating]   = useState(false)
  const [apiError, setApiError]       = useState('')

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleImageSelected(file, preview) {
    setImage(file)
    setImagePreview(preview)
    setStep(prev => Math.max(prev, 2))
  }

  function handleTranscript(text) {
    setTranscript(text)
    if (text) setStep(prev => Math.max(prev, 2))
  }

  async function handleGenerateStoryCard() {
    if (!transcript.trim()) {
      alert('Please record your voice first — tell us about your artwork!')
      return
    }

    setGenerating(true)
    setStoryCard(null)
    setApiError('')
    setStep(3)

    try {
      const res = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: buildPrompt(transcript),
          }],
        }),
      })

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`)
      }

      const data = await res.json()

      // Extract text content from Claude's response
      const rawText = data.content
        ?.filter(block => block.type === 'text')
        ?.map(block => block.text)
        ?.join('') || ''

      // Strip any accidental markdown fences and parse JSON
      const cleaned = rawText.replace(/```json|```/gi, '').trim()
      const parsed  = JSON.parse(cleaned)

      // Validate required fields — fill gaps gracefully
      const card = {
        artistName:     parsed.artistName     || 'Meena Devi',
        title:          parsed.title          || 'Untitled Artwork',
        story:          parsed.story          || rawText,
        artForm:        parsed.artForm        || 'Folk Art',
        region:         parsed.region         || 'India',
        rarity:         parsed.rarity         || 'Stable',
        suggestedPrice: parsed.suggestedPrice || 3500,
        tags:           Array.isArray(parsed.tags) ? parsed.tags : [],
      }

      setStoryCard(card)

    } catch (err) {
      console.error('Story generation failed:', err)
      setApiError('Could not connect to AI — showing a sample story card.')
      setStoryCard(FALLBACK_STORY)
    } finally {
      setGenerating(false)
    }
  }

  function handlePublish() {
    setStep(4)
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="page-bg">
      <Ticker />
      <Navbar role="artist" />

      <main style={{
        position: 'relative', zIndex: 5,
        maxWidth: 960, margin: '0 auto',
        padding: '48px 40px 80px',
      }}>

        {/* Page heading */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-label">Artist Studio</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#2C1A0E',
          }}>
            Share your <em style={{ color: '#C1603A' }}>art</em> with the world
          </h1>
          <div className="gold-divider" />
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48, alignItems: 'center', flexWrap: 'wrap' }}>
          {['Upload Art', 'Record Voice', 'Story Card', 'Go Live'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step >= i + 1
                  ? 'linear-gradient(135deg, #C1603A, #E8913A)'
                  : 'rgba(193,96,58,0.1)',
                border: step >= i + 1 ? 'none' : '2px solid rgba(193,96,58,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 700,
                color: step >= i + 1 ? 'white' : '#C1603A',
                transition: 'all 0.3s',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '0.82rem', fontWeight: 600,
                color: step === i + 1 ? '#C1603A' : step > i + 1 ? '#4A3728' : '#aaa',
                transition: 'color 0.3s',
              }}>
                {s}
              </span>
              {i < 3 && (
                <div style={{
                  width: 40, height: 1,
                  background: step > i + 1
                    ? 'linear-gradient(90deg, #C1603A, #E8913A)'
                    : 'rgba(193,96,58,0.15)',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* API error notice */}
        {apiError && (
          <div style={{
            marginBottom: 24, padding: '12px 18px',
            background: 'rgba(212,168,67,0.1)',
            border: '1px solid rgba(212,168,67,0.3)',
            borderRadius: 10,
            fontSize: '0.84rem', color: '#4A3728',
          }}>
            ⚠ {apiError}
          </div>
        )}

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Step 1 — Upload Artwork */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 6,
              }}>
                1. Upload Your Artwork
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#4A3728', marginBottom: 20, lineHeight: 1.6 }}>
                Take a clear photo of your artwork — Kahaani will enhance it for you.
              </p>
              <ImageUploader
                onImageSelected={handleImageSelected}
                imagePreview={imagePreview}
              />
            </div>

            {/* Step 2 — Voice */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 6,
              }}>
                2. Speak About Your Art
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#4A3728', marginBottom: 20, lineHeight: 1.6 }}>
                Tell us in <strong>any language</strong> — your words, your story, your voice.
                The more you describe, the richer your story card will be.
              </p>
              <VoiceRecorder onTranscript={handleTranscript} />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateStoryCard}
              disabled={!transcript.trim() || generating}
              className="btn-primary"
              style={{
                width: '100%',
                fontSize: '1rem',
                padding: '16px',
                opacity: !transcript.trim() ? 0.45 : 1,
                cursor: !transcript.trim() || generating ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {generating ? '🐘 Weaving your story...' : '✨ Generate My Story Card'}
            </button>

            {!transcript && (
              <p style={{
                textAlign: 'center', fontSize: '0.8rem',
                color: '#aaa', marginTop: -12,
              }}>
                Record your voice first to unlock this
              </p>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* AI Image Enhancement */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 6,
              }}>
                AI Image Enhancement
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#4A3728', marginBottom: 16, lineHeight: 1.6 }}>
                Drag the slider to see how Kahaani restores and brightens your artwork.
              </p>
              <ImageRestoration imageSrc={imagePreview} />
            </div>

            {/* Story Card output */}
            <div className="glass-card" style={{
              padding: 28,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 260,
            }}>
              {/* Rainbow top bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: 'linear-gradient(90deg, #C1603A, #D4A843, #4AADA8)',
              }} />

              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 16,
              }}>
                3. Your Story Card
              </h2>

              <StoryCard
                storyCard={storyCard}
                generating={generating}
                onPublish={handlePublish}
              />
            </div>
          </div>
        </div>

        {/* ── Success / Live state ── */}
        {step === 4 && (
          <div style={{
            marginTop: 40, padding: '48px 40px',
            background: 'linear-gradient(135deg, rgba(74,173,168,0.08), rgba(193,96,58,0.06))',
            border: '1px solid rgba(74,173,168,0.25)',
            borderRadius: 20, textAlign: 'center',
            animation: 'fadeUp 0.5s ease',
          }}>
            <div style={{ fontSize: '3.2rem', marginBottom: 14 }}>🎉</div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.9rem', color: '#2C1A0E', marginBottom: 14,
            }}>
              Your art is now <em style={{ color: '#4AADA8' }}>live on Kahaani!</em>
            </h2>
            <p style={{
              fontSize: '0.95rem', color: '#4A3728',
              lineHeight: 1.8, maxWidth: 500, margin: '0 auto 24px',
            }}>
              Buyers worldwide can now discover your artwork,<br />
              read your story, and commission you directly — no middlemen.
            </p>
            {storyCard && (
              <div style={{
                display: 'inline-flex', gap: 8, alignItems: 'center',
                padding: '10px 20px',
                background: 'rgba(193,96,58,0.08)',
                border: '1px solid rgba(193,96,58,0.2)',
                borderRadius: 20,
                fontSize: '0.84rem', color: '#C1603A', fontWeight: 600,
              }}>
                🎨 {storyCard.title} · ₹{storyCard.suggestedPrice?.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
