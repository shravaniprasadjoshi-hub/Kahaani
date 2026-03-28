import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Ticker from '../components/Ticker'
import Navbar from '../components/Navbar'
import womanImg from '../assets/woman_artist.png'

const TITLE = 'Kahaani'

// ── Mandala SVG (from file 2 — rotating bg decoration) ──────────────────────
function Mandala({ size = 400, style }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width: size, height: size, ...style }}>
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 30} 100 100)`}>
          <ellipse cx="100" cy="40" rx="6" ry="20" fill="#C1603A" />
          <ellipse cx="100" cy="60" rx="4" ry="14" fill="#D4A843" />
        </g>
      ))}
      <circle cx="100" cy="100" r="20" fill="#E8913A" opacity="0.6" />
      <circle cx="100" cy="100" r="10" fill="#D4A843" />
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={100 + 35 * Math.cos((i * 45 * Math.PI) / 180)}
          cy={100 + 35 * Math.sin((i * 45 * Math.PI) / 180)}
          r="5"
          fill="#4AADA8"
        />
      ))}
    </svg>
  )
}

// ── Rajasthani woman silhouette (from file 2 — right panel bg motif) ─────────
function RajasthaniWoman() {
  return (
    <svg
      viewBox="0 0 200 340"
      style={{
        width: '100%',
        maxWidth: 320,
        opacity: 0.12,
        position: 'absolute',
        right: 40,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <ellipse cx="100" cy="60" rx="30" ry="35" fill="#C1603A" />
      <path
        d="M70 90 Q60 140 50 200 Q80 220 100 220 Q120 220 150 200 Q140 140 130 90 Z"
        fill="#E8913A"
      />
      <path
        d="M50 200 Q30 260 20 320 L60 320 Q70 270 100 250 Q130 270 140 320 L180 320 Q170 260 150 200 Z"
        fill="#C1603A"
      />
      <circle cx="55" cy="160" r="8" fill="none" stroke="#D4A843" strokeWidth="3" />
      <circle cx="145" cy="160" r="8" fill="none" stroke="#D4A843" strokeWidth="3" />
      <path
        d="M70 90 Q40 120 20 160 Q40 170 60 150 Q70 130 80 110 Z"
        fill="#4AADA8"
        opacity="0.7"
      />
      <ellipse cx="100" cy="28" rx="22" ry="14" fill="#D4A843" />
      <rect x="88" y="14" width="24" height="14" rx="4" fill="#C1603A" />
    </svg>
  )
}

// ── Peacock decoration (from file 2) ─────────────────────────────────────────
function Peacock({ style }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: 80, height: 80, opacity: 0.1, ...style }}>
      <circle cx="60" cy="70" r="18" fill="#4AADA8" />
      <ellipse cx="60" cy="50" rx="10" ry="14" fill="#C1603A" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <ellipse
          key={i}
          cx={60 + 35 * Math.cos((angle * Math.PI) / 180)}
          cy={50 + 35 * Math.sin((angle * Math.PI) / 180)}
          rx="8"
          ry="14"
          fill="#D4A843"
          transform={`rotate(${angle}, ${60 + 35 * Math.cos((angle * Math.PI) / 180)}, ${
            50 + 35 * Math.sin((angle * Math.PI) / 180)
          })`}
        />
      ))}
    </svg>
  )
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  // Typewriter state (from file 1)
  const [displayed, setDisplayed]         = useState('')
  const [titleDone, setTitleDone]         = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [hoverTitle, setHoverTitle]       = useState(false)

  // Staggered reveal state (from file 1)
  const [showTagline, setShowTagline]   = useState(false)
  const [showBody, setShowBody]         = useState(false)
  const [showButtons, setShowButtons]   = useState(false)
  const [showStats, setShowStats]       = useState(false)
  const [showWoman, setShowWoman]       = useState(false)


  useEffect(() => {
    let i = 0
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(TITLE.slice(0, i))
        if (i === TITLE.length) {
          clearInterval(interval)
          setTitleDone(true)
          setTimeout(() => setShowTagline(true),  200)
          setTimeout(() => setShowBody(true),     480)
          setTimeout(() => setShowButtons(true),  750)
          setTimeout(() => setShowStats(true),    980)
          setTimeout(() => setShowWoman(true),   1150)

        }
      }, 110)
      return () => clearInterval(interval)
    }, 300)

    const cursorBlink = setInterval(() => setCursorVisible(v => !v), 530)

    return () => {
      clearTimeout(startDelay)
      clearInterval(cursorBlink)
    }
  }, [])

  return (
    <div className="page-bg" style={{ overflow: 'hidden' }}>

      {/* ── Rotating mandala bg decorations (from file 2) ── */}
      <Mandala
        size={440}
        style={{
          position: 'fixed', top: -120, right: -120,
          opacity: 0.06, zIndex: 0, pointerEvents: 'none',
          animation: 'rotateSlow 60s linear infinite',
        }}
      />
      <Mandala
        size={380}
        style={{
          position: 'fixed', bottom: -100, left: -100,
          opacity: 0.05, zIndex: 0, pointerEvents: 'none',
          animation: 'rotateSlow 80s linear infinite reverse',
        }}
      />

      <Ticker />
      <Navbar />

      {/* ── Hero ── */}
      <main style={{
        position: 'relative',
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '85vh',
        padding: '0 60px',
        gap: 0,
        overflow: 'hidden',
      }}>

        {/* ─── LEFT: Text content (file 1 — all animations kept) ─── */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 60px 60px 0',
          position: 'relative', zIndex: 3,
        }}>
          <div className="section-label" style={{
            opacity: titleDone ? 1 : 0,
            transform: titleDone ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            Voice-first cultural marketplace
          </div>

          {/* Typewriter title */}
          <h1
            onMouseEnter={() => setHoverTitle(true)}
            onMouseLeave={() => setHoverTitle(false)}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 8,
              background: 'linear-gradient(135deg, #C1603A 30%, #D4A843)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              cursor: 'default',
              display: 'inline-block',
              transform: hoverTitle ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease',
              filter: hoverTitle
                ? 'drop-shadow(0 14px 28px rgba(193,96,58,0.3))'
                : 'drop-shadow(0 2px 6px rgba(193,96,58,0.08))',
            }}
          >
            {displayed}
            {!titleDone && (
              <span style={{
                display: 'inline-block',
                width: 3,
                height: '0.85em',
                background: 'linear-gradient(180deg, #C1603A, #D4A843)',
                marginLeft: 4,
                verticalAlign: 'middle',
                borderRadius: 2,
                opacity: cursorVisible ? 1 : 0,
                transition: 'opacity 0.08s',
              }} />
            )}
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontStyle: 'italic',
            color: '#4A3728',
            marginBottom: 20,
            lineHeight: 1.5,
            opacity: showTagline ? 1 : 0,
            transform: showTagline ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.55s ease, transform 0.55s ease',
          }}>
            "She speaks. The world listens.<br />
            <span style={{ color: '#C1603A' }}>Her art sells.</span>"
          </p>

          <div className="gold-divider" style={{
            marginBottom: 24,
            opacity: showBody ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }} />

          {/* Description */}
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: '#4A3728',
            maxWidth: 440,
            marginBottom: 40,
            opacity: showBody ? 1 : 0,
            transform: showBody ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.55s ease, transform 0.55s ease',
          }}>
            India's women folk artists carry centuries of living heritage in their hands —
            yet remain invisible to the world. Kahaani gives them a voice, a story, and a marketplace.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32,
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            <button className="btn-outline" onClick={() => navigate('/about')} style={{ fontSize: '0.9rem' }}>
              About Kahaani
            </button>
            <button className="btn-primary" onClick={() => navigate('/auth/artist')} style={{ fontSize: '0.9rem' }}>
              🎨 I'm an Artist
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate('/auth/buyer')}
              style={{ fontSize: '0.9rem', background: 'linear-gradient(135deg, #4AADA8, #2E7D7A)' }}
            >
              🌏 I'm a Buyer
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 40,
            opacity: showStats ? 1 : 0,
            transform: showStats ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            {[
              { num: '50+', label: 'Living art forms' },
              { num: '8',   label: 'Endangered crafts' },
              { num: '₹0', label: 'Cost to join' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.8rem', fontWeight: 700, color: '#C1603A',
                }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4A3728', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Woman image (file 1) + voice card overlay (file 2) ─── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>

          {/* Rajasthani silhouette motif behind card (file 2) */}
          <RajasthaniWoman />

          {/* Peacock decorations (file 2) */}
          <Peacock style={{ position: 'absolute', top: 24, right: 24, zIndex: 1 }} />
          <Peacock style={{ position: 'absolute', bottom: 48, left: 16, zIndex: 1 }} />

          {/* Warm radial glow (file 1) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '60%',
            background: 'radial-gradient(ellipse at 50% 100%, rgba(212,168,67,0.13) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          {/* Woman artist image (file 1) — full height, edges masked into bg */}
          <img
            src={womanImg}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -12,
              left: '50%',
              transform: `translateX(-50%) translateY(${showWoman ? '0px' : '40px'})`,
              height: '92vh',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              mixBlendMode: 'multiply',
              filter: 'sepia(16%) saturate(108%) brightness(1.04) contrast(0.95)',
              opacity: showWoman ? 0.9 : 0,
              zIndex: 1,
              pointerEvents: 'none',
              transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 78%, transparent 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 78%, transparent 100%)',
            }}
          />


        </div>
      </main>

      {/* Bottom colour stripe */}
      <div style={{
        height: 12,
        background: 'repeating-linear-gradient(90deg, #C1603A 0px, #C1603A 20px, #D4A843 20px, #D4A843 40px, #4AADA8 40px, #4AADA8 60px)',
        position: 'relative', zIndex: 5,
      }} />

      <style>{`
        @keyframes wave {
          from { transform: scaleY(1); }
          to   { transform: scaleY(1.6); }
        }
        @keyframes rotateSlow {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
