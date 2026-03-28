const RARITY_CONFIG = {
  Endangered: { score: 95, color: '#9B3E20', label: 'Critically Endangered', emoji: '🔴' },
  Critical:   { score: 80, color: '#C1603A', label: 'Critical',             emoji: '⚠️' },
  Vulnerable: { score: 55, color: '#D4A843', label: 'Vulnerable',           emoji: '🟡' },
  Stable:     { score: 25, color: '#4AADA8', label: 'Stable',               emoji: '🟢' },
}

export default function RarityMeter({ rarity, artistCount, artForm }) {
  const config = RARITY_CONFIG[rarity] || RARITY_CONFIG['Vulnerable']

  return (
    <div style={{
      padding: '16px 20px',
      background: `${config.color}08`,
      border: `1px solid ${config.color}25`,
      borderRadius: 12,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: config.color }}>
          {config.emoji} {config.label}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#888' }}>
          Rarity Index: {config.score}/100
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8, background: 'rgba(0,0,0,0.08)',
        borderRadius: 4, overflow: 'hidden', marginBottom: 10,
      }}>
        <div style={{
          height: '100%',
          width: `${config.score}%`,
          background: `linear-gradient(90deg, ${config.color}, ${config.color}aa)`,
          borderRadius: 4,
          transition: 'width 1s ease',
        }}/>
      </div>

      {/* Artist count */}
      {artistCount && (
        <div style={{ fontSize: '0.78rem', color: '#4A3728' }}>
          👩‍🎨 {artistCount}
          {artForm && <span style={{ color: '#888' }}> practicing {artForm}</span>}
        </div>
      )}
    </div>
  )
}
