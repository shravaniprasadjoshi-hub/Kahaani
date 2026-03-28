import { useState } from 'react'

export default function ArtworkCard({ art, onCommission }) {
  const [hovered, setHovered] = useState(false)

  const artwork = art.sampleArtworks?.[0]
  const rarityColor = art.rarity === 'Critical' || art.rarity === 'Endangered'
    ? '#9B3E20' : '#D4A843'

  return (
    <div
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 40px rgba(193,96,58,0.2)'
          : '0 4px 16px rgba(193,96,58,0.08)',
        cursor: 'pointer',
      }}
    >
      {/* Artwork thumbnail */}
      <div style={{
        height: 180,
        background: `linear-gradient(135deg, ${art.color}40, ${art.color}18)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          fontSize: '4rem', opacity: 0.55,
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s',
        }}>
          {art.emoji}
        </div>

        {/* Rarity badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: '0.68rem', padding: '3px 10px',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 20,
          color: rarityColor, fontWeight: 700,
          border: `1px solid ${rarityColor}30`,
        }}>
          ⚠ {art.rarity}
        </div>

        {/* Art form tag */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          fontSize: '0.68rem', padding: '3px 10px',
          background: art.color,
          borderRadius: 20, color: 'white', fontWeight: 600,
        }}>
          {art.name}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.05rem', fontWeight: 700,
          color: '#2C1A0E', marginBottom: 4,
        }}>
          {artwork?.title}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 10 }}>
          {artwork?.artist} · {art.region}
        </div>
        <div style={{
          fontSize: '0.76rem', color: '#4A3728',
          marginBottom: 16, lineHeight: 1.5,
        }}>
          {art.artistCount}
        </div>

        {/* Price + commission row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid rgba(212,168,67,0.2)',
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#888', marginBottom: 2 }}>Price</div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.25rem', fontWeight: 700, color: '#C1603A',
            }}>
              ₹{artwork?.price?.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => onCommission(art)}
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #C1603A, #E8913A)',
              color: 'white', border: 'none', borderRadius: 8,
              fontFamily: 'Raleway, sans-serif', fontWeight: 700,
              fontSize: '0.8rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(193,96,58,0.3)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Commission →
          </button>
        </div>
      </div>
    </div>
  )
}
