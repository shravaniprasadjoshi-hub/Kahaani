import { useNavigate } from 'react-router-dom'
import Ticker from '../components/Ticker'
import Navbar from '../components/Navbar'

// Rajasthani SVG decorative woman silhouette
function RajasthaniWoman() {
  return (
    <svg viewBox="0 0 200 340" style={{ width: '100%', maxWidth: 320, opacity: 0.15, position: 'absolute', right: 40, bottom: 0 }}>
      <ellipse cx="100" cy="60" rx="30" ry="35" fill="#C1603A"/>
      <path d="M70 90 Q60 140 50 200 Q80 220 100 220 Q120 220 150 200 Q140 140 130 90 Z" fill="#E8913A"/>
      <path d="M50 200 Q30 260 20 320 L60 320 Q70 270 100 250 Q130 270 140 320 L180 320 Q170 260 150 200 Z" fill="#C1603A"/>
      {/* Bangles */}
      <circle cx="55" cy="160" r="8" fill="none" stroke="#D4A843" strokeWidth="3"/>
      <circle cx="145" cy="160" r="8" fill="none" stroke="#D4A843" strokeWidth="3"/>
      {/* Dupatta */}
      <path d="M70 90 Q40 120 20 160 Q40 170 60 150 Q70 130 80 110 Z" fill="#4AADA8" opacity="0.7"/>
      {/* Pot on head */}
      <ellipse cx="100" cy="28" rx="22" ry="14" fill="#D4A843"/>
      <rect x="88" y="14" width="24" height="14" rx="4" fill="#C1603A"/>
    </svg>
  )
}

// Peacock SVG decoration
function Peacock({ style }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: 80, height: 80, opacity: 0.12, ...style }}>
      <circle cx="60" cy="70" r="18" fill="#4AADA8"/>
      <ellipse cx="60" cy="50" rx="10" ry="14" fill="#C1603A"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
        <ellipse key={i} cx={60 + 35*Math.cos(angle*Math.PI/180)} cy={50 + 35*Math.sin(angle*Math.PI/180)}
          rx="8" ry="14" fill="#D4A843" transform={`rotate(${angle}, ${60 + 35*Math.cos(angle*Math.PI/180)}, ${50 + 35*Math.sin(angle*Math.PI/180)})`}/>
      ))}
    </svg>
  )
}

// Mandala SVG
function Mandala({ size = 400, style }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width: size, height: size, ...style }}>
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`rotate(${i*30} 100 100)`}>
          <ellipse cx="100" cy="40" rx="6" ry="20" fill="#C1603A"/>
          <ellipse cx="100" cy="60" rx="4" ry="14" fill="#D4A843"/>
        </g>
      ))}
      <circle cx="100" cy="100" r="20" fill="#E8913A" opacity="0.6"/>
      <circle cx="100" cy="100" r="10" fill="#D4A843"/>
      {[...Array(8)].map((_, i) => (
        <circle key={i} cx={100 + 35*Math.cos(i*45*Math.PI/180)} cy={100 + 35*Math.sin(i*45*Math.PI/180)} r="5" fill="#4AADA8"/>
      ))}
    </svg>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="page-bg">
      {/* Mandala decorations */}
      <Mandala size={440} style={{
        position: 'fixed', top: -120, right: -120,
        opacity: 0.06, zIndex: 0, pointerEvents: 'none',
        animation: 'rotateSlow 60s linear infinite',
      }}/>
      <Mandala size={380} style={{
        position: 'fixed', bottom: -100, left: -100,
        opacity: 0.05, zIndex: 0, pointerEvents: 'none',
        animation: 'rotateSlow 80s linear infinite reverse',
      }}/>

      {/* Ticker */}
      <Ticker />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main style={{
        position: 'relative', zIndex: 5,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '85vh',
        padding: '0 60px',
        gap: 0,
        overflow: 'hidden',
      }}>
        {/* Left: Text content */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 60px 60px 0',
        }}>
          <div className="section-label">Voice-first cultural marketplace</div>

          {/* Main KAHAANI title */}
          <h1 style={{
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
          }}>
            Kahaani
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontStyle: 'italic',
            color: '#4A3728',
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            "She speaks. The world listens.<br/>
            <span style={{ color: '#C1603A' }}>Her art sells.</span>"
          </p>

          <div className="gold-divider" style={{ marginBottom: 24 }}/>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: '#4A3728',
            maxWidth: 440,
            marginBottom: 40,
          }}>
            India's women folk artists carry centuries of living heritage in their hands —
            yet remain invisible to the world. Kahaani gives them a voice, a story, and a marketplace.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
            <button className="btn-outline" onClick={() => navigate('/about')}
              style={{ fontSize: '0.9rem' }}>
              About Kahaani
            </button>
            <button className="btn-primary" onClick={() => navigate('/auth/artist')}
              style={{ fontSize: '0.9rem' }}>
              🎨 I'm an Artist
            </button>
            <button className="btn-primary" onClick={() => navigate('/auth/buyer')}
              style={{
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #4AADA8, #2E7D7A)',
              }}>
              🌏 I'm a Buyer
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { num: '50+', label: 'Living art forms' },
              { num: '8', label: 'Endangered crafts' },
              { num: '₹0', label: 'Cost to join' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#C1603A',
                }}>{stat.num}</div>
                <div style={{ fontSize: '0.78rem', color: '#4A3728', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual panel */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Glassmorphism card */}
          <div className="glass-card" style={{
            padding: 40,
            maxWidth: 380,
            position: 'relative',
            zIndex: 2,
          }}>
            {/* Jharokha corners */}
            {['tl','tr','bl','br'].map(pos => (
              <div key={pos} style={{
                position: 'absolute',
                width: 24, height: 24,
                border: '3px solid #D4A843',
                borderRadius: pos.includes('t') && pos.includes('l') ? '6px 0 0 0'
                  : pos.includes('t') ? '0 6px 0 0'
                  : pos.includes('l') ? '0 0 0 6px' : '0 0 6px 0',
                ...(pos.includes('t') ? { top: -10 } : { bottom: -10 }),
                ...(pos.includes('l') ? { left: -10 } : { right: -10 }),
                borderRight: pos.includes('r') ? '3px solid #D4A843' : 'none',
                borderLeft: pos.includes('l') ? '3px solid #D4A843' : 'none',
                borderTop: pos.includes('t') ? '3px solid #D4A843' : 'none',
                borderBottom: pos.includes('b') ? '3px solid #D4A843' : 'none',
              }}/>
            ))}

            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4AADA8', marginBottom: 12 }}>
              🎙️ Live from Palghar, Maharashtra
            </div>

            {/* Fake voice waveform */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
              {[14,20,28,18,32,22,16,26,20,14,30,24,18,22,28].map((h, i) => (
                <div key={i} style={{
                  width: 4, height: h,
                  background: 'linear-gradient(180deg, #C1603A, #E8913A)',
                  borderRadius: 2,
                  animation: `wave ${0.5 + i*0.1}s ease-in-out infinite alternate`,
                }}/>
              ))}
            </div>

            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontSize: '0.88rem',
              lineHeight: 1.8,
              color: '#4A3728',
              marginBottom: 16,
            }}>
              "यह रंग मैंने अपनी माँ से सीखे हैं..."<br/>
              <span style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'normal' }}>
                "These colours I learned from my mother..."
              </span>
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Warli Art', 'Maharashtra', '🟡 Vulnerable', '2500 years old'].map(tag => (
                <span key={tag} style={{
                  fontSize: '0.7rem',
                  padding: '3px 10px',
                  background: 'rgba(193,96,58,0.1)',
                  border: '1px solid rgba(193,96,58,0.25)',
                  borderRadius: 20,
                  color: '#C1603A',
                  fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>

            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: '1px solid rgba(212,168,67,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.82rem', color: '#4A3728' }}>Meena Warli · Palghar</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#C1603A', fontSize: '1.1rem' }}>₹3,200</span>
            </div>
          </div>

          {/* Rajasthani woman silhouette */}
          <RajasthaniWoman/>

          {/* Peacock decorations */}
          <Peacock style={{ position: 'absolute', top: 20, right: 20 }}/>
          <Peacock style={{ position: 'absolute', bottom: 40, left: 10 }}/>
        </div>
      </main>

      {/* Rajasthani border pattern at bottom */}
      <div style={{
        height: 12,
        background: 'repeating-linear-gradient(90deg, #C1603A 0px, #C1603A 20px, #D4A843 20px, #D4A843 40px, #4AADA8 40px, #4AADA8 60px)',
        position: 'relative', zIndex: 5,
      }}/>

      <style>{`
        @keyframes wave {
          from { transform: scaleY(1); }
          to { transform: scaleY(1.6); }
        }
      `}</style>
    </div>
  )
}
