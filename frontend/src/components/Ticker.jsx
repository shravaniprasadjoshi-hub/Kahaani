const tickerItems = [
  { art: 'Toda Embroidery', state: 'Tamil Nadu', artists: 43, level: '🔴 CRITICAL' },
  { art: 'Phulkari Embroidery', state: 'Punjab', artists: 140, level: '⚠️ ENDANGERED' },
  { art: 'Madhubani Painting', state: 'Bihar', artists: 180, level: '⚠️ ENDANGERED' },
  { art: 'Chikankari', state: 'Uttar Pradesh', artists: 300, level: '🟡 VULNERABLE' },
  { art: 'Warli Painting', state: 'Maharashtra', artists: 320, level: '🟡 VULNERABLE' },
  { art: 'Pattachitra', state: 'Odisha', artists: 250, level: '🟡 VULNERABLE' },
  { art: 'Gond Art', state: 'Madhya Pradesh', artists: 400, level: '🟡 VULNERABLE' },
]

export default function Ticker() {
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <div style={{
      position: 'relative', zIndex: 10,
      background: 'linear-gradient(90deg, #C1603A, #9B3E20, #C1603A)',
      color: '#FDF6EC',
      padding: '10px 0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* HIGH URGENCY label */}
      <div style={{
        background: '#D4A843',
        color: '#2C1A0E',
        fontWeight: 700,
        fontSize: '0.72rem',
        letterSpacing: '0.12em',
        padding: '4px 28px 4px 16px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
      }}>
        ⚡ HIGH URGENCY
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{
          display: 'flex',
          animation: 'ticker 40s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {doubled.map((item, i) => (
            <span key={i} style={{
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              padding: '0 40px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{
                width: 7, height: 7,
                borderRadius: '50%',
                background: '#D4A843',
                display: 'inline-block',
                flexShrink: 0,
              }} />
              {item.level} &nbsp;·&nbsp; <strong>{item.art}</strong> ({item.state}) — only {item.artists} active artists remain
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
