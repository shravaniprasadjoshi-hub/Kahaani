import { useEffect, useState } from 'react'

// Animates story text word by word on first render
function TypewriterText({ text, style }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    const words = text.split(' ')
    let i = 0
    const iv = setInterval(() => {
      i++
      setShown(words.slice(0, i).join(' '))
      if (i >= words.length) clearInterval(iv)
    }, 45)
    return () => clearInterval(iv)
  }, [text])

  return <span style={style}>{shown}</span>
}

export default function StoryCard({ storyCard, generating, onPublish }) {
  // ── Loading state ──
  if (generating) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: '2.8rem', marginBottom: 14 }}>🐘</div>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: '0.92rem',
          color: '#4A3728',
          marginBottom: 20,
          lineHeight: 1.7,
        }}>
          Weaving your story with care...<br />
          <span style={{ fontSize: '0.8rem', color: '#888' }}>
            Translating your voice into a story buyers will love
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C1603A, #E8913A)',
              animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`
          @keyframes dotBounce {
            0%,100%{transform:translateY(0);opacity:0.35}
            50%{transform:translateY(-9px);opacity:1}
          }
        `}</style>
      </div>
    )
  }

  // ── Empty state ──
  if (!storyCard) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', opacity: 0.5 }}>
        <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>📜</div>
        <div style={{ fontSize: '0.84rem', color: '#4A3728', lineHeight: 1.6 }}>
          Record your voice and click <strong>Generate Story Card</strong> —<br />
          your AI-crafted story will appear here, ready for buyers to discover.
        </div>
      </div>
    )
  }

  // ── Story Card ──
  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>

      {/* Artist name + region */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C1603A, #E8913A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', flexShrink: 0,
          color: 'white', fontWeight: 700,
          fontFamily: 'Playfair Display, serif',
        }}>
          {storyCard.artistName?.[0] || 'A'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2C1A0E' }}>
            {storyCard.artistName}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#888' }}>
            {storyCard.artForm} · {storyCard.region}
          </div>
        </div>
      </div>

      {/* Artwork title */}
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.2rem',
        fontWeight: 700,
        color: '#2C1A0E',
        marginBottom: 14,
        lineHeight: 1.3,
      }}>
        {storyCard.title}
      </div>

      {/* Story — typewriter animated */}
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontStyle: 'italic',
        fontSize: '0.9rem',
        lineHeight: 1.9,
        color: '#4A3728',
        marginBottom: 18,
        borderLeft: '3px solid rgba(212,168,67,0.6)',
        paddingLeft: 16,
        background: 'rgba(212,168,67,0.04)',
        borderRadius: '0 8px 8px 0',
        padding: '14px 14px 14px 16px',
      }}>
        "<TypewriterText text={storyCard.story} />"
      </div>

      {/* Cultural tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {storyCard.tags?.map(tag => (
          <span key={tag} style={{
            fontSize: '0.7rem', padding: '3px 10px',
            background: 'rgba(193,96,58,0.08)',
            border: '1px solid rgba(193,96,58,0.22)',
            borderRadius: 20, color: '#C1603A', fontWeight: 600,
          }}>
            {tag}
          </span>
        ))}
        {storyCard.rarity && (
          <span style={{
            fontSize: '0.7rem', padding: '3px 10px',
            background: 'rgba(155,62,32,0.08)',
            border: '1px solid rgba(155,62,32,0.22)',
            borderRadius: 20, color: '#9B3E20', fontWeight: 700,
          }}>
            ⚠ {storyCard.rarity}
          </span>
        )}
      </div>

      {/* Art form + region pills */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 18,
        fontSize: '0.8rem', color: '#4A3728',
      }}>
        <span style={{
          padding: '4px 12px',
          background: 'rgba(74,173,168,0.08)',
          border: '1px solid rgba(74,173,168,0.25)',
          borderRadius: 20, color: '#4AADA8', fontWeight: 600,
        }}>
          🎨 {storyCard.artForm}
        </span>
        <span style={{
          padding: '4px 12px',
          background: 'rgba(74,58,40,0.06)',
          border: '1px solid rgba(74,58,40,0.15)',
          borderRadius: 20, fontWeight: 600,
        }}>
          📍 {storyCard.region}
        </span>
      </div>

      {/* Price row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px',
        background: 'rgba(193,96,58,0.05)',
        border: '1px solid rgba(193,96,58,0.12)',
        borderRadius: 10,
        marginBottom: 18,
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: 2 }}>
            Suggested fair price
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem', fontWeight: 700, color: '#C1603A',
          }}>
            ₹{storyCard.suggestedPrice?.toLocaleString()}
          </div>
        </div>
        <div style={{
          fontSize: '0.72rem', color: '#4AADA8', fontWeight: 600,
          textAlign: 'right', maxWidth: 130, lineHeight: 1.5,
        }}>
          100% goes to you<br />No commission to start
        </div>
      </div>

      {/* Publish button */}
      {onPublish && (
        <button
          onClick={onPublish}
          className="btn-primary"
          style={{ width: '100%', fontSize: '0.95rem' }}
        >
          🚀 Publish to Marketplace
        </button>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
