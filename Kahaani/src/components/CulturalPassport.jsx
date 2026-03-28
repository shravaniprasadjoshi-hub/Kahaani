import artForms from '../data/artForms.json'

export default function CulturalPassport({ collected = [] }) {
  const total = artForms.length

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2C1A0E, #4A3728)',
      borderRadius: 20,
      padding: '32px 36px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Inner decorative border */}
      <div style={{
        position: 'absolute', inset: 8,
        border: '1px solid rgba(212,168,67,0.2)',
        borderRadius: 14, pointerEvents: 'none',
      }}/>

      {/* Corner ornaments */}
      {['tl','tr','bl','br'].map(pos => (
        <div key={pos} style={{
          position: 'absolute',
          width: 20, height: 20,
          ...(pos.includes('t') ? { top: 14 } : { bottom: 14 }),
          ...(pos.includes('l') ? { left: 14 } : { right: 14 }),
          borderTop:    pos.includes('t') ? '2px solid rgba(212,168,67,0.5)' : 'none',
          borderBottom: pos.includes('b') ? '2px solid rgba(212,168,67,0.5)' : 'none',
          borderLeft:   pos.includes('l') ? '2px solid rgba(212,168,67,0.5)' : 'none',
          borderRight:  pos.includes('r') ? '2px solid rgba(212,168,67,0.5)' : 'none',
        }}/>
      ))}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24,
      }}>
        <div>
          <div style={{
            fontSize: '0.7rem', letterSpacing: '0.2em',
            color: 'rgba(212,168,67,0.7)', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Cultural Heritage Passport
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.4rem', marginBottom: 4,
          }}>
            Heritage Collector
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            {collected.length} of {total} art forms discovered
          </div>
        </div>
        <div style={{ fontSize: '2.8rem' }}>📕</div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, background: 'rgba(255,255,255,0.1)',
        borderRadius: 3, marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${(collected.length / total) * 100}%`,
          background: 'linear-gradient(90deg, #C1603A, #D4A843)',
          borderRadius: 3, transition: 'width 0.6s ease',
        }}/>
      </div>

      {/* Stamp grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {artForms.map(art => {
          const isEarned = collected.includes(art.id)
          return (
            <div key={art.id} style={{
              aspectRatio: '1',
              border: `2px ${isEarned ? 'solid' : 'dashed'} ${isEarned ? art.color : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: isEarned ? `${art.color}22` : 'rgba(255,255,255,0.03)',
              transition: 'all 0.3s',
              padding: 8,
              transform: isEarned ? 'scale(1)' : 'scale(0.96)',
            }}>
              <div style={{
                fontSize: '1.4rem', marginBottom: 4,
                filter: isEarned ? 'none' : 'grayscale(100%) opacity(0.25)',
              }}>
                {art.emoji}
              </div>
              <div style={{
                fontSize: '0.58rem', textAlign: 'center',
                color: isEarned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                fontWeight: isEarned ? 700 : 400,
                lineHeight: 1.3,
              }}>
                {art.name.split(' ')[0]}
              </div>
              {isEarned && (
                <div style={{ fontSize: '0.6rem', color: '#D4A843', fontWeight: 700 }}>✓</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 20, paddingTop: 16,
        borderTop: '1px solid rgba(212,168,67,0.15)',
        fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)',
        textAlign: 'center',
      }}>
        Every commission earns a stamp · funds the artist directly
      </div>
    </div>
  )
}
