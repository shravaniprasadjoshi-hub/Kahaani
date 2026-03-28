import { useState } from 'react'
import Navbar from '../components/Navbar'
import Ticker from '../components/Ticker'
import ArtworkCard from '../components/ArtworkCard'
import CulturalPassport from '../components/CulturalPassport'
import FilterBar from '../components/FilterBar'
import artForms from '../data/artForms.json'

// Hardcoded accurate pin positions (viewBox 0 0 500 580)
const PIN_POSITIONS = {
  warli:      { cx: 102, cy: 332 },
  madhubani:  { cx: 315, cy: 215 },
  phulkari:   { cx: 178, cy: 118 },
  gond:       { cx: 242, cy: 285 },
  toda:       { cx: 188, cy: 462 },
  pattachitra:{ cx: 330, cy: 322 },
  blockprint: { cx: 148, cy: 215 },
  chikankari: { cx: 250, cy: 210 },
}

// ── India Map ──
function IndiaMap({ onPinClick }) {
  const [hoveredPin, setHoveredPin] = useState(null)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 500 580" style={{ width: '100%' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mapFill" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="rgba(212,168,67,0.12)"/>
            <stop offset="100%" stopColor="rgba(193,96,58,0.06)"/>
          </radialGradient>
        </defs>

        {/* Main India body */}
        <path
          d="M148,55 L172,38 L208,32 L248,38 L285,78 L315,87 L340,82 L362,92 L385,115 L400,142 L394,168 L376,182 L360,205 L364,232 L357,259 L346,286 L333,313 L316,339 L298,364 L280,388 L264,413 L251,438 L248,465 L248,492 L248,520 L248,548 L236,530 L221,504 L204,477 L186,449 L169,421 L153,392 L137,363 L125,334 L113,306 L103,279 L96,253 L90,232 L84,210 L80,188 L80,166 L86,148 L94,132 L102,115 L110,99 L118,83 L130,68 L140,57 L148,55 Z"
          fill="url(#mapFill)"
          stroke="#C1603A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Gujarat peninsula */}
        <path
          d="M90,232 L80,222 L72,209 L68,194 L70,179 L80,167 L96,160 L115,158 L133,165 L147,179 L152,196 L145,211 L126,221 L106,229 L90,234 Z"
          fill="url(#mapFill)"
          stroke="#C1603A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Kashmir */}
        <path
          d="M148,55 L165,42 L185,36 L208,32 L200,48 L182,56 L162,60 Z"
          fill="rgba(74,173,168,0.1)"
          stroke="rgba(74,173,168,0.4)"
          strokeWidth="1"
        />

        {/* Northeast */}
        <path
          d="M376,182 L394,168 L400,142 L415,135 L420,155 L412,178 L396,192 L380,195 Z"
          fill="rgba(74,173,168,0.08)"
          stroke="rgba(74,173,168,0.3)"
          strokeWidth="1"
        />

        {/* Sri Lanka */}
        <ellipse cx="268" cy="565" rx="10" ry="14"
          fill="rgba(193,96,58,0.08)" stroke="rgba(193,96,58,0.25)" strokeWidth="1"/>

        {/* Mandala watermark */}
        <g opacity="0.05" transform="translate(220,310)">
          {[...Array(12)].map((_, i) => (
            <ellipse key={i} cx="0" cy="-36" rx="5" ry="14" fill="#C1603A"
              transform={`rotate(${i*30})`}/>
          ))}
          <circle cx="0" cy="0" r="12" fill="#D4A843"/>
          <circle cx="0" cy="0" r="5" fill="#C1603A"/>
        </g>

        {/* State name hints */}
        {[
          { x: 168, y: 175, label: 'Rajasthan' },
          { x: 270, y: 158, label: 'Uttar Pradesh' },
          { x: 215, y: 255, label: 'Madhya Pradesh' },
          { x: 120, y: 290, label: 'Maharashtra' },
          { x: 320, y: 278, label: 'Odisha' },
        ].map(r => (
          <text key={r.label} x={r.x} y={r.y} textAnchor="middle"
            fontSize="9" fill="rgba(74,58,40,0.3)"
            fontFamily="Raleway,sans-serif"
            style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {r.label}
          </text>
        ))}

        {/* Pins */}
        {artForms.map(art => {
          const pos = PIN_POSITIONS[art.id]
          if (!pos) return null
          const { cx, cy } = pos
          const isHovered = hoveredPin?.id === art.id

          return (
            <g key={art.id} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPin(art)}
              onMouseLeave={() => setHoveredPin(null)}
              onClick={() => onPinClick(art)}
            >
              <circle cx={cx} cy={cy} r={isHovered ? 26 : 18}
                fill="none" stroke={art.color} strokeWidth="1"
                opacity={isHovered ? 0.5 : 0.2}
                style={{ transition: 'all 0.25s' }}
              />
              <circle cx={cx} cy={cy} r={isHovered ? 18 : 13}
                fill={art.color} opacity="0.2"
                style={{ transition: 'all 0.25s' }}
              />
              <circle cx={cx} cy={cy} r={isHovered ? 11 : 8}
                fill={art.color} stroke="white"
                strokeWidth={isHovered ? 2.5 : 2}
                style={{ transition: 'all 0.25s', filter: isHovered ? `drop-shadow(0 0 6px ${art.color})` : 'none' }}
              />
              <text x={cx} y={cy + (isHovered ? 4 : 3)}
                textAnchor="middle" fontSize={isHovered ? "9" : "7"}
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {art.emoji}
              </text>
              <text x={cx} y={cy + (isHovered ? 28 : 23)}
                textAnchor="middle" fontSize={isHovered ? "9.5" : "8"}
                fontWeight="700" fill={art.color}
                style={{ pointerEvents: 'none', fontFamily: 'Raleway,sans-serif', userSelect: 'none' }}>
                {art.name.split(' ')[0]}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Hover panel */}
      {hoveredPin && (() => {
        const pos = PIN_POSITIONS[hoveredPin.id]
        const panelLeft = pos && pos.cx < 260
        return (
          <div style={{
            position: 'absolute',
            ...(panelLeft ? { right: 0 } : { left: 0 }),
            top: '10%',
            width: 272,
            background: '#FDF6EC',
            border: '1px solid rgba(212,168,67,0.45)',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(193,96,58,0.22)',
            zIndex: 30,
            animation: 'fadeSlide 0.2s ease',
          }}>
            <div style={{
              height: 52,
              background: `linear-gradient(135deg, ${hoveredPin.color}, #E8913A)`,
              display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{hoveredPin.emoji}</span>
              <div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: '0.95rem', color: 'white', fontWeight: 700 }}>
                  {hoveredPin.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)' }}>
                  {hoveredPin.region}
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                  background: `${hoveredPin.color}18`, border: `1px solid ${hoveredPin.color}40`,
                  color: hoveredPin.color,
                }}>⚠ {hoveredPin.rarity}</span>
                <span style={{
                  fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                  background: 'rgba(74,173,168,0.1)', border: '1px solid rgba(74,173,168,0.3)',
                  color: '#4AADA8',
                }}>{hoveredPin.ageOfArt} old</span>
              </div>
              <div style={{
                fontSize: '0.76rem', color: '#9B3E20', fontWeight: 700,
                marginBottom: 10, padding: '6px 10px',
                background: 'rgba(155,62,32,0.06)', borderRadius: 8,
                border: '1px solid rgba(155,62,32,0.15)',
              }}>
                👩‍🎨 {hoveredPin.artistCount}
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.65, color: '#4A3728', marginBottom: 14 }}>
                {hoveredPin.history.slice(0, 145)}...
              </p>
              <button onClick={() => onPinClick(hoveredPin)} style={{
                width: '100%', padding: '9px',
                background: `linear-gradient(135deg, ${hoveredPin.color}, #E8913A)`,
                color: 'white', border: 'none', borderRadius: 9,
                fontFamily: 'Raleway,sans-serif', fontWeight: 700,
                fontSize: '0.82rem', cursor: 'pointer',
              }}>
                Explore {hoveredPin.name.split(' ')[0]} art →
              </button>
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes fadeSlide {
          from{opacity:0;transform:translateY(-6px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </div>
  )
}

// ── Main Buyer Page ──
export default function BuyerPage() {
  const [activeSection, setActiveSection] = useState('explore')
  const [selectedArt, setSelectedArt] = useState(null)
  const [collectedStamps, setCollectedStamps] = useState(['warli', 'gond'])
  const [filterRarity, setFilterRarity] = useState('All')
  const [filterState, setFilterState] = useState('All')
  const [commissioned, setCommissioned] = useState(null)

  function handlePinClick(art) {
    setSelectedArt(art)
    setActiveSection('marketplace')
  }

  function handleCommission(art) {
    setCommissioned(art)
    if (!collectedStamps.includes(art.id)) {
      setCollectedStamps(prev => [...prev, art.id])
    }
  }

  const filteredArts = artForms.filter(a => {
    const rarityMatch = filterRarity === 'All' || a.rarity === filterRarity
    const stateMatch = filterState === 'All' || a.state === filterState
    return rarityMatch && stateMatch
  })

  const displayArts = selectedArt ? [selectedArt] : filteredArts

  return (
    <div className="page-bg">
      <Ticker />
      <Navbar role="buyer" />

      <main style={{ position: 'relative', zIndex: 5, maxWidth: 1100, margin: '0 auto', padding: '48px 40px 80px' }}>

        <div style={{ marginBottom: 40 }}>
          <div className="section-label">Buyer Dashboard</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#2C1A0E' }}>
            Explore <em style={{ color: '#C1603A' }}>Indian Arts</em>
          </h1>
          <div className="gold-divider"/>
        </div>

        {/* Section tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 40,
          background: 'rgba(193,96,58,0.06)', borderRadius: 12,
          padding: 4, width: 'fit-content',
        }}>
          {[
            { id: 'explore',     label: '🗺️ Explore India' },
            { id: 'passport',    label: '📕 Cultural Passport' },
            { id: 'marketplace', label: '🛍️ Marketplace' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
              padding: '10px 24px', borderRadius: 10, border: 'none',
              fontFamily: 'Raleway, sans-serif', fontWeight: 600, fontSize: '0.88rem',
              cursor: 'pointer', transition: 'all 0.2s',
              background: activeSection === tab.id ? 'linear-gradient(135deg, #C1603A, #E8913A)' : 'transparent',
              color: activeSection === tab.id ? 'white' : '#4A3728',
              boxShadow: activeSection === tab.id ? '0 4px 12px rgba(193,96,58,0.25)' : 'none',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── EXPLORE INDIA ── */}
        {activeSection === 'explore' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '0.92rem', color: '#4A3728', lineHeight: 1.7, marginBottom: 24, maxWidth: 500 }}>
                Each pin marks a living art tradition kept alive by women artists.
                <strong style={{ color: '#C1603A' }}> Hover to learn its story. Click to explore its marketplace.</strong>
              </p>
              <div className="glass-card" style={{ padding: 24 }}>
                <IndiaMap onPinClick={handlePinClick} />
              </div>
              {/* Legend */}
              <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { color: '#9B3E20', label: 'Endangered / Critical' },
                  { color: '#D4A843', label: 'Vulnerable' },
                  { color: '#4AADA8', label: 'Stable' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#4A3728' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }}/>
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Art forms list */}
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#2C1A0E', marginBottom: 20 }}>
                All Art Forms
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {artForms.map(art => (
                  <div key={art.id} className="glass-card" onClick={() => handlePinClick(art)}
                    style={{
                      padding: '16px 20px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14,
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${art.color}20`, border: `1px solid ${art.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>{art.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2C1A0E' }}>{art.name}</div>
                      <div style={{ fontSize: '0.76rem', color: '#888' }}>{art.state}</div>
                    </div>
                    <div style={{
                      fontSize: '0.66rem', padding: '2px 8px',
                      borderRadius: 12, fontWeight: 700,
                      background: `${art.color}15`, color: art.color,
                      border: `1px solid ${art.color}30`,
                    }}>{art.rarity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CULTURAL PASSPORT ── */}
        {activeSection === 'passport' && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <p style={{ fontSize: '0.95rem', color: '#4A3728', lineHeight: 1.7, marginBottom: 32, textAlign: 'center' }}>
              Every artwork you commission earns you a stamp. Collect all 8 to become a
              <strong style={{ color: '#C1603A' }}> Heritage Guardian</strong>.
            </p>
            {/* ✅ CulturalPassport component used here */}
            <CulturalPassport collected={collectedStamps} />
            {collectedStamps.length > 0 && (
              <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.88rem', color: '#4A3728' }}>
                🎉 You've collected <strong>{collectedStamps.length}</strong> art forms —
                explore <strong>{artForms.length - collectedStamps.length}</strong> more in the marketplace!
              </div>
            )}
          </div>
        )}

        {/* ── MARKETPLACE ── */}
        {activeSection === 'marketplace' && (
          <div>
            {/* Active filter tag */}
            {selectedArt && (
              <div style={{
                padding: '16px 24px', marginBottom: 28,
                background: `${selectedArt.color}12`,
                border: `1px solid ${selectedArt.color}30`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: '1.4rem' }}>{selectedArt.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#2C1A0E' }}>Filtered by: {selectedArt.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{selectedArt.region}</div>
                </div>
                <button onClick={() => setSelectedArt(null)} style={{
                  marginLeft: 'auto', padding: '6px 14px',
                  border: '1px solid rgba(193,96,58,0.3)', borderRadius: 8,
                  background: 'transparent', cursor: 'pointer',
                  fontSize: '0.8rem', color: '#C1603A', fontFamily: 'Raleway, sans-serif',
                }}>Clear filter ×</button>
              </div>
            )}

            {/* ✅ FilterBar component used here */}
            {!selectedArt && (
              <FilterBar
                activeRarity={filterRarity}
                activeState={filterState}
                onRarityChange={setFilterRarity}
                onStateChange={setFilterState}
              />
            )}

            {/* ✅ ArtworkCard component used here */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {displayArts.map(art => (
                <ArtworkCard key={art.id} art={art} onCommission={handleCommission} />
              ))}
            </div>
          </div>
        )}

        {/* Commission success modal */}
        {commissioned && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(44,26,14,0.6)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} onClick={() => setCommissioned(null)}>
            <div className="glass-card" style={{ padding: 48, maxWidth: 440, width: '90%', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#2C1A0E', marginBottom: 12 }}>
                Commission Sent!
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#4A3728', lineHeight: 1.7, marginBottom: 24 }}>
                Your commission has been sent to <strong>{commissioned.sampleArtworks?.[0]?.artist}</strong>.
                Payment goes directly to her — no middlemen.
                Your passport has been stamped with <strong>{commissioned.emoji} {commissioned.name}</strong>!
              </p>
              <div style={{
                padding: '12px 20px', marginBottom: 20,
                background: `${commissioned.color}15`,
                border: `1px solid ${commissioned.color}30`,
                borderRadius: 10,
                fontSize: '0.82rem', color: commissioned.color, fontWeight: 600,
              }}>
                📕 New stamp added to your Cultural Passport!
              </div>
              <button className="btn-primary" onClick={() => setCommissioned(null)} style={{ width: '100%' }}>
                Continue Exploring →
              </button>
            </div>
          </div>
        )}
      </main>

      <div style={{
        height: 12,
        background: 'repeating-linear-gradient(90deg, #C1603A 0px, #C1603A 20px, #D4A843 20px, #D4A843 40px, #4AADA8 40px, #4AADA8 60px)',
      }}/>
    </div>
  )
}
