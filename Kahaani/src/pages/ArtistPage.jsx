import { useState } from 'react'
import Navbar from '../components/Navbar'
import Ticker from '../components/Ticker'
import VoiceRecorder from '../components/VoiceRecorder'
import ImageUploader from '../components/ImageUploader'
import ImageRestoration from '../components/ImageRestoration'
import StoryCard from '../components/StoryCard'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

export default function ArtistPage() {
  const [step, setStep] = useState(1)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [storyCard, setStoryCard] = useState(null)
  const [generating, setGenerating] = useState(false)

  function handleImageSelected(file, preview) {
    setImage(file)
    setImagePreview(preview)
    setStep(2)
  }

  async function handleGenerateStoryCard() {
    if (!transcript) { alert('Please record your voice first!'); return }
    setGenerating(true)
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
            content: `You are a cultural storyteller for Kahaani, a marketplace for Indian women folk artists.

An artist has described her artwork in her own language. Transform this into a beautiful, poetic story card in English.

Artist's words: "${transcript}"

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "artistName": "infer a typical Indian woman artist name",
  "title": "a poetic artwork title",
  "story": "2-3 sentences of beautiful storytelling about this artwork and the tradition it comes from",
  "artForm": "likely art form based on description",
  "region": "likely region of India",
  "rarity": "one of: Endangered / Critical / Vulnerable / Stable",
  "suggestedPrice": number between 2000 and 20000,
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setStoryCard(parsed)
    } catch (err) {
      setStoryCard({
        artistName: 'Meena Warli',
        title: 'Song of the Harvest Moon',
        story: 'These patterns were taught to me by my grandmother at the age of seven, her hands guiding mine through the sacred geometry of our ancestors. Every circle is the sun and moon — the giver of life. Every triangle is the mountain that protects us.',
        artForm: 'Warli Painting',
        region: 'Palghar, Maharashtra',
        rarity: 'Vulnerable',
        suggestedPrice: 4200,
        tags: ['Warli', 'Maharashtra', 'Tribal Art', '2500 years old'],
      })
    }

    setGenerating(false)
  }

  return (
    <div className="page-bg">
      <Ticker />
      <Navbar role="artist" />

      <main style={{ position: 'relative', zIndex: 5, maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>

        <div style={{ marginBottom: 48 }}>
          <div className="section-label">Artist Studio</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#2C1A0E' }}>
            Share your <em style={{ color: '#C1603A' }}>art</em> with the world
          </h1>
          <div className="gold-divider"/>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48, alignItems: 'center' }}>
          {['Upload Art', 'Record Voice', 'Story Card', 'Go Live'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step >= i + 1 ? 'linear-gradient(135deg, #C1603A, #E8913A)' : 'rgba(193,96,58,0.1)',
                border: step >= i + 1 ? 'none' : '2px solid rgba(193,96,58,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 700,
                color: step >= i + 1 ? 'white' : '#C1603A',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: step === i + 1 ? '#C1603A' : '#888' }}>
                {s}
              </span>
              {i < 3 && <div style={{ width: 40, height: 1, background: 'rgba(193,96,58,0.2)' }}/>}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Step 1 — Upload */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 6 }}>
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
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 6 }}>
                2. Speak About Your Art
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#4A3728', marginBottom: 20, lineHeight: 1.6 }}>
                Tell us in <strong>any language</strong> — Hindi, Kannada, Tamil, or your native tongue.
              </p>
              <VoiceRecorder onTranscript={setTranscript} />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateStoryCard}
              disabled={!transcript || generating}
              className="btn-primary"
              style={{
                width: '100%', fontSize: '1rem', padding: '16px',
                opacity: !transcript ? 0.5 : 1,
                cursor: !transcript ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? '🐘 Weaving your story...' : '✨ Generate Story Card'}
            </button>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Image Restoration */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 6 }}>
                AI Image Enhancement
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#4A3728', marginBottom: 16, lineHeight: 1.6 }}>
                Drag the slider to see how Kahaani restores and brightens your artwork.
              </p>
              <ImageRestoration imageSrc={imagePreview} />
            </div>

            {/* Story Card output */}
            <div className="glass-card" style={{ padding: 28, position: 'relative', overflow: 'hidden', minHeight: 240 }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: 'linear-gradient(90deg, #C1603A, #D4A843, #4AADA8)',
              }}/>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#2C1A0E', marginBottom: 16 }}>
                3. Your Story Card
              </h2>
              <StoryCard
                storyCard={storyCard}
                generating={generating}
                onPublish={() => setStep(4)}
              />
            </div>
          </div>
        </div>

        {/* Success state */}
        {step === 4 && (
          <div style={{
            marginTop: 40, padding: '40px',
            background: 'linear-gradient(135deg, rgba(74,173,168,0.1), rgba(193,96,58,0.08))',
            border: '1px solid rgba(74,173,168,0.3)',
            borderRadius: 20, textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#2C1A0E', marginBottom: 12 }}>
              Your art is now <em style={{ color: '#4AADA8' }}>live on Kahaani!</em>
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#4A3728', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              Buyers worldwide can now discover your artwork, read your story, and commission you directly.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
