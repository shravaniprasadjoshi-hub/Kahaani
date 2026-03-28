const RARITIES = ['All', 'Endangered', 'Critical', 'Vulnerable', 'Stable']
const STATES = ['All', 'Maharashtra', 'Bihar', 'Punjab', 'Madhya Pradesh', 'Tamil Nadu', 'Odisha', 'Rajasthan', 'Uttar Pradesh']

export default function FilterBar({ activeRarity, activeState, onRarityChange, onStateChange }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {/* Rarity filters */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#888', marginBottom: 8,
        }}>
          Filter by Rarity
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {RARITIES.map(r => {
            const isActive = (activeRarity || 'All') === r
            const color = r === 'Endangered' ? '#9B3E20'
              : r === 'Critical' ? '#C1603A'
              : r === 'Vulnerable' ? '#D4A843'
              : r === 'Stable' ? '#4AADA8'
              : '#4A3728'

            return (
              <button
                key={r}
                onClick={() => onRarityChange(r)}
                style={{
                  padding: '7px 16px', borderRadius: 20,
                  border: `1.5px solid ${isActive ? '#C1603A' : 'rgba(193,96,58,0.2)'}`,
                  background: isActive
                    ? 'linear-gradient(135deg, #C1603A, #E8913A)'
                    : 'transparent',
                  color: isActive ? 'white' : color,
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {r === 'All' ? 'All Art Forms' : `⚠ ${r}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* State filters */}
      <div>
        <div style={{
          fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#888', marginBottom: 8,
        }}>
          Filter by State
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATES.map(s => {
            const isActive = (activeState || 'All') === s
            return (
              <button
                key={s}
                onClick={() => onStateChange(s)}
                style={{
                  padding: '7px 16px', borderRadius: 20,
                  border: `1.5px solid ${isActive ? '#4AADA8' : 'rgba(74,173,168,0.2)'}`,
                  background: isActive
                    ? 'linear-gradient(135deg, #4AADA8, #2E7D7A)'
                    : 'transparent',
                  color: isActive ? 'white' : '#4AADA8',
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {s === 'All' ? '🇮🇳 All States' : `📍 ${s}`}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
