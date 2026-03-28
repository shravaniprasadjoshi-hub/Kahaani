import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Ticker from '../components/Ticker'
import ArtworkCard from '../components/ArtworkCard'
import CulturalPassport from '../components/CulturalPassport'
import FilterBar from '../components/FilterBar'
import imageMap from '../data/imageMap'
import artForms from '../data/artForms.json'
import IndiaSVG from '../assets/india.svg'

// Enrich artForms with icon images from imageMap
const enrichedData = artForms.map((art) => ({
  ...art,
  icon: imageMap[art.id],
}))

// ── India Map ────────────────────────────────────────────────────────────────
// Uses your IndiaSVG image + percentage-based pinX/pinY from artForms.json
// Hover panel smart-positions left or right based on pin location
function IndiaMap({ onPinClick }) {
  const [hoveredPin, setHoveredPin] = useState(null)

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* India SVG outline image */}
      <div style={{ position: 'relative', width: '100%' }}>
        <img
          src={IndiaSVG}
          alt="India map"
          style={{ width: '100%', maxHeight: 520, pointerEvents: 'none' }}
        />

        {/* Art form PINS — positioned by pinX / pinY percentages from artForms.json */}
        {enrichedData.map(art => {
          const isHovered = hoveredPin?.id === art.id

          return (
            <div
              key={art.id}
              style={{
                position: 'absolute',
                zIndex: 5,
                left: `${art.pinX}%`,
                top: `${art.pinY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Glow ring on hover */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: art.color,
                    opacity: 0.15,
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Pin dot */}
              <div
                style={{
                  width: isHovered ? 16 : 12,
                  height: isHovered ? 16 : 12,
                  borderRadius: '50%',
                  background: art.color,
                  border: '2px solid white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isHovered ? `0 0 10px ${art.color}` : 'none',
                }}
                onMouseEnter={() => setHoveredPin(art)}
                onMouseLeave={() => setTimeout(() => setHoveredPin(null), 300)}
                onClick={() => onPinClick(art)}
              />

              {/* Art name label */}
              <div
                style={{
                  marginTop: 6,
                  fontSize: isHovered ? '10px' : '9px',
                  fontWeight: 600,
                  color: art.color,
                  textAlign: 'center',
                  fontFamily: 'Raleway, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {art.name.split(' ')[0]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating hover panel — smart left/right based on pin position */}
      {hoveredPin && (() => {
        const panelOnRight = hoveredPin.pinX < 55
        return (
          <div
            onMouseEnter={() => {}}
            onMouseLeave={() => setHoveredPin(null)}
            style={{
              position: 'absolute',
              ...(panelOnRight ? { right: 0 } : { left: 0 }),
              top: '12%',
              width: 272,
              background: '#FDF6EC',
              border: '1px solid rgba(212,168,67,0.45)',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(193,96,58,0.22)',
              zIndex: 30,
              animation: 'fadeSlide 0.2s ease',
              pointerEvents: 'auto',
            }}
          >
            {/* Gradient header with icon */}
            <div
              style={{
                height: 58,
                background: `linear-gradient(135deg, ${hoveredPin.color}, #E8913A)`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 18px',
              }}
            >
              <img
                src={hoveredPin.icon}
                alt={hoveredPin.name}
                style={{ width: 30, height: 30, objectFit: 'contain' }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '0.95rem',
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {hoveredPin.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)' }}>
                  {hoveredPin.region}
                </div>
              </div>
            </div>

            {/* Panel body */}
            <div style={{ padding: '14px 18px' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontWeight: 700,
                    background: `${hoveredPin.color}18`,
                    border: `1px solid ${hoveredPin.color}40`,
                    color: hoveredPin.color,
                  }}
                >
                  ⚠ {hoveredPin.rarity}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontWeight: 600,
                    background: 'rgba(74,173,168,0.1)',
                    border: '1px solid rgba(74,173,168,0.3)',
                    color: '#4AADA8',
                  }}
                >
                  {hoveredPin.ageOfArt} old
                </span>
              </div>

              {/* Artist count */}
              <div
                style={{
                  fontSize: '0.76rem',
                  color: '#9B3E20',
                  fontWeight: 700,
                  marginBottom: 10,
                  padding: '6px 10px',
                  background: 'rgba(155,62,32,0.06)',
                  borderRadius: 8,
                  border: '1px solid rgba(155,62,32,0.15)',
                }}
              >
                👩‍🎨 {hoveredPin.artistCount}
              </div>

              {/* History snippet */}
              <p
                style={{
                  fontSize: '0.8rem',
                  lineHeight: 1.65,
                  color: '#4A3728',
                  marginBottom: 14,
                }}
              >
                {hoveredPin.history.slice(0, 145)}...
              </p>

              {/* CTA button */}
              <button
                onClick={() => onPinClick(hoveredPin)}
                style={{
                  width: '100%',
                  padding: '9px',
                  background: `linear-gradient(135deg, ${hoveredPin.color}, #E8913A)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: 9,
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Explore {hoveredPin.name.split(' ')[0]} art →
              </button>
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Main Buyer Page ───────────────────────────────────────────────────────────
export default function BuyerPage() {
  const navigate = useNavigate()

  // Section tabs
  const [activeSection, setActiveSection] = useState('explore')

  // Map → Marketplace filter
  const [selectedArt, setSelectedArt] = useState(null)

  // Cultural Passport stamps
  const [collectedStamps, setCollectedStamps] = useState(['warli', 'gond'])

  // Marketplace filters
  const [filterRarity, setFilterRarity] = useState('All')
  const [filterState,  setFilterState]  = useState('All')

  // Commission success modal
  const [commissioned, setCommissioned] = useState(null)

  // ── Handlers ────────────────────────────────────────────
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

  // ── Filtered arts for Marketplace ───────────────────────
  const filteredArts = enrichedData.filter(a => {
    const rarityMatch = filterRarity === 'All' || a.rarity === filterRarity
    const stateMatch  = filterState  === 'All' || a.state  === filterState
    return rarityMatch && stateMatch
  })

  const displayArts = selectedArt ? [selectedArt] : filteredArts

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="page-bg">
      <Ticker />
      <Navbar role="buyer" />

      <main
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '48px 40px 80px',
        }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">Buyer Dashboard</div>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: '#2C1A0E',
            }}
          >
            Explore <em style={{ color: '#C1603A' }}>Indian Arts</em>
          </h1>
          <div className="gold-divider" />
        </div>

        {/* ── Section tabs ── */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginBottom: 40,
            background: 'rgba(193,96,58,0.06)',
            borderRadius: 12,
            padding: 4,
            width: 'fit-content',
          }}
        >
          {[
            { id: 'explore',     label: '🗺️ Explore India' },
            { id: 'passport',    label: '📕 Cultural Passport' },
            { id: 'marketplace', label: '🛍️ Marketplace' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background:
                  activeSection === tab.id
                    ? 'linear-gradient(135deg, #C1603A, #E8913A)'
                    : 'transparent',
                color: activeSection === tab.id ? 'white' : '#4A3728',
                boxShadow:
                  activeSection === tab.id
                    ? '0 4px 12px rgba(193,96,58,0.25)'
                    : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION — EXPLORE INDIA
        ══════════════════════════════════════════════════════ */}
        {activeSection === 'explore' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 360px',
              gap: 40,
              alignItems: 'start',
            }}
          >
            {/* Left — map */}
            <div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#4A3728',
                  lineHeight: 1.7,
                  marginBottom: 24,
                  maxWidth: 500,
                }}
              >
                Each pin marks a living art tradition kept alive by women artists.
                <br />
                <strong style={{ color: '#C1603A' }}>
                  Hover to learn its story. Click to explore its marketplace.
                </strong>
              </p>

              <div className="glass-card" style={{ padding: 24 }}>
                <IndiaMap onPinClick={handlePinClick} />
              </div>

              {/* Legend */}
              <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { color: '#800000', label: 'Endangered / Critical' },
                  { color: '#F15BB5', label: 'Vulnerable' },
                  { color: '#0F4C5C',  label: 'Stable' },
                ].map(l => (
                  <div
                    key={l.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.78rem',
                      color: '#4A3728',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: l.color,
                      }}
                    />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — art forms list */}
            <div>
              <h3
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem',
                  color: '#2C1A0E',
                  marginBottom: 20,
                }}
              >
                All Art Forms
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {enrichedData.map(art => (
                  <div
                    key={art.id}
                    className="glass-card"
                    onClick={() => handlePinClick(art)}
                    style={{
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.transform = 'translateX(4px)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.transform = 'translateX(0)')
                    }
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: `${art.color}20`,
                        border: `2px solid ${art.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={art.icon}
                        alt={art.name}
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                    </div>

                    {/* Name + state */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          color: '#2C1A0E',
                        }}
                      >
                        {art.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#888' }}>
                        {art.state}
                      </div>
                    </div>

                    {/* Rarity pill */}
                    <div
                      style={{
                        fontSize: '0.66rem',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontWeight: 700,
                        background: `${art.color}15`,
                        color: art.color,
                        border: `1px solid ${art.color}30`,
                      }}
                    >
                      {art.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SECTION — CULTURAL PASSPORT
        ══════════════════════════════════════════════════════ */}
        {activeSection === 'passport' && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#4A3728',
                lineHeight: 1.7,
                marginBottom: 32,
                textAlign: 'center',
              }}
            >
              Every artwork you commission earns you a stamp. Collect all{' '}
              {artForms.length} to become a{' '}
              <strong style={{ color: '#C1603A' }}>Heritage Guardian</strong>.
            </p>

            {/* CulturalPassport component — receives collected stamp IDs */}
            <CulturalPassport collected={collectedStamps} />

            {collectedStamps.length > 0 && (
              <div
                style={{
                  marginTop: 24,
                  textAlign: 'center',
                  fontSize: '0.88rem',
                  color: '#4A3728',
                }}
              >
                🎉 You've collected{' '}
                <strong>{collectedStamps.length}</strong> art forms — explore{' '}
                <strong>{artForms.length - collectedStamps.length}</strong> more
                in the marketplace!
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SECTION — MARKETPLACE
        ══════════════════════════════════════════════════════ */}
        {activeSection === 'marketplace' && (
          <div>
            {/* Active art-form filter tag (set by clicking a map pin) */}
            {selectedArt && (
              <div
                style={{
                  padding: '16px 24px',
                  marginBottom: 28,
                  background: `${selectedArt.color}12`,
                  border: `1px solid ${selectedArt.color}30`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <img
                  src={selectedArt.icon}
                  alt={selectedArt.name}
                  style={{ width: 28, height: 28, objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#2C1A0E' }}>
                    Filtered by: {selectedArt.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    {selectedArt.region}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArt(null)}
                  style={{
                    marginLeft: 'auto',
                    padding: '6px 14px',
                    border: '1px solid rgba(193,96,58,0.3)',
                    borderRadius: 8,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: '#C1603A',
                    fontFamily: 'Raleway, sans-serif',
                  }}
                >
                  Clear filter ×
                </button>
              </div>
            )}

            {/* FilterBar component — rarity + state dropdowns (hidden when map filter active) */}
            {!selectedArt && (
              <FilterBar
                activeRarity={filterRarity}
                activeState={filterState}
                onRarityChange={setFilterRarity}
                onStateChange={setFilterState}
              />
            )}

            {/* ArtworkCard grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
                marginTop: 24,
              }}
            >
              {displayArts.map(art => (
                <ArtworkCard
                  key={art.id}
                  art={{ ...art, icon: imageMap[art.id] }}
                  onCommission={handleCommission}
                />
              ))}
            </div>

            {/* Empty state */}
            {displayArts.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 0',
                  color: '#888',
                  fontSize: '0.92rem',
                }}
              >
                No art forms match your filters.{' '}
                <button
                  onClick={() => {
                    setFilterRarity('All')
                    setFilterState('All')
                  }}
                  style={{
                    color: '#C1603A',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'Raleway, sans-serif',
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Commission success modal ── */}
        {commissioned && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(44,26,14,0.6)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setCommissioned(null)}
          >
            <div
              className="glass-card"
              style={{ padding: 48, maxWidth: 440, width: '90%', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.6rem',
                  color: '#2C1A0E',
                  marginBottom: 12,
                }}
              >
                Commission Sent!
              </h2>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#4A3728',
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Your commission has been sent to{' '}
                <strong>{commissioned.sampleArtworks?.[0]?.artist}</strong>.
                Payment goes directly to her — no middlemen. Your Cultural
                Passport has been stamped with{' '}
                <strong>{commissioned.name}</strong>!
              </p>

              <div
                style={{
                  padding: '12px 20px',
                  marginBottom: 20,
                  background: `${commissioned.color}15`,
                  border: `1px solid ${commissioned.color}30`,
                  borderRadius: 10,
                  fontSize: '0.82rem',
                  color: commissioned.color,
                  fontWeight: 600,
                }}
              >
                📕 New stamp added to your Cultural Passport!
              </div>

              <button
                className="btn-primary"
                onClick={() => setCommissioned(null)}
                style={{ width: '100%' }}
              >
                Continue Exploring →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Kahaani colour stripe footer */}
      <div
        style={{
          height: 12,
          background:
            'repeating-linear-gradient(90deg, #C1603A 0px, #C1603A 20px, #D4A843 20px, #D4A843 40px, #4AADA8 40px, #4AADA8 60px)',
        }}
      />
    </div>
  )
}
