export default function StoryCard({ storyCard, generating, onPublish }) {
  if (generating) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🐘</div>
        <div style={{ fontSize: '0.88rem', color: '#4A3728', fontStyle: 'italic' }}>
          Weaving your story with care...
        </div>
        <div style={{
          marginTop: 16,
          display: 'flex', gap: 4, justifyContent: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#C1603A',
              animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}/>
          ))}
        </div>
        <style>{`
          @keyframes dotBounce {
            0%,100%{transform:translateY(0);opacity:0.4}
            50%{transform:translateY(-8px);opacity:1}
          }
        `}</style>
      </div>
    )
  }

  if (!storyCard) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📜</div>
        <div style={{ fontSize: '0.84rem', color: '#4A3728' }}>
          Record your voice and click Generate — your AI story card will appear here
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Title and artist */}
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.15rem', fontWeight: 700,
        color: '#2C1A0E', marginBottom: 4,
      }}>
        {storyCard.title}
      </div>
      <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 14 }}>
        by {storyCard.artistName} · {storyCard.region}
      </div>

      {/* Story text with typewriter feel */}
      <p style={{
        fontFamily: 'Playfair Display, serif',
        fontStyle: 'italic',
        fontSize: '0.88rem',
        lineHeight: 1.85,
        color: '#4A3728',
        marginBottom: 16,
        borderLeft: '3px solid rgba(212,168,67,0.5)',
        paddingLeft: 14,
      }}>
        "{storyCard.story}"
      </p>

      {/* Cultural tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {storyCard.tags?.map(tag => (
          <span key={tag} style={{
            fontSize: '0.7rem', padding: '3px 10px',
            background: 'rgba(193,96,58,0.1)',
            border: '1px solid rgba(193,96,58,0.25)',
            borderRadius: 20, color: '#C1603A', fontWeight: 600,
          }}>{tag}</span>
        ))}
        {storyCard.rarity && (
          <span style={{
            fontSize: '0.7rem', padding: '3px 10px',
            background: 'rgba(155,62,32,0.1)',
            border: '1px solid rgba(155,62,32,0.25)',
            borderRadius: 20, color: '#9B3E20', fontWeight: 700,
          }}>⚠ {storyCard.rarity}</span>
        )}
      </div>

      {/* Art form + region */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 16,
        fontSize: '0.8rem', color: '#4A3728',
      }}>
        <span>🎨 {storyCard.artForm}</span>
        <span>📍 {storyCard.region}</span>
      </div>

      {/* Price row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 0',
        borderTop: '1px solid rgba(212,168,67,0.25)',
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 2 }}>Suggested fair price</div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.4rem', fontWeight: 700, color: '#C1603A',
          }}>
            ₹{storyCard.suggestedPrice?.toLocaleString()}
          </div>
        </div>
        <div style={{
          fontSize: '0.72rem', color: '#4AADA8', fontWeight: 600,
          textAlign: 'right', maxWidth: 120,
        }}>
          100% goes to you — no commission yet
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
    </div>
  )
}
