import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Ticker from '../components/Ticker'

const steps = [
  {
    icon: '🎙️',
    title: 'She speaks',
    desc: 'The artist records her story in her own language — Hindi, Kannada, Tamil, or any Indian tongue. No typing. No forms. Just her voice.',
  },
  {
    icon: '✨',
    title: 'Kahaani listens',
    desc: 'Our AI transforms her words into a beautifully crafted bilingual story card — tagged with the cultural lineage, rarity, and heritage of her art.',
  },
  {
    icon: '🌍',
    title: 'The world discovers',
    desc: 'Her artwork goes live on the Kahaani marketplace. Buyers worldwide discover, explore, and commission directly from her.',
  },
  {
    icon: '💰',
    title: 'She earns fairly',
    desc: 'Payment goes directly to her — no middlemen, no commission until she is verified and thriving. Her success is our success.',
  },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="page-bg">
      <Ticker />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 5, padding: '60px 80px', maxWidth: 960, margin: '0 auto' }}>

        {/* Hero section */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Our story</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
            lineHeight: 1.15,
            color: '#2C1A0E',
            marginBottom: 24,
          }}>
            What is <em style={{ color: '#C1603A' }}>Kahaani</em>?
          </h1>
          <div className="gold-divider" style={{ margin: '0 auto 28px' }}/>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.9,
            color: '#4A3728',
            maxWidth: 680,
            margin: '0 auto 20px',
          }}>
            Kahaani is a voice-first cultural marketplace that connects India's women folk artists
            directly to buyers worldwide. Artists speak about their work in their own language,
            and Kahaani transforms it into a rich AI-powered story card that carries their name,
            their craft, and their cultural legacy to the world.
          </p>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.9,
            color: '#4A3728',
            maxWidth: 680,
            margin: '0 auto',
          }}>
            No middlemen. No barriers. No exploitation. Just her art — reaching the world it always deserved.
          </p>
        </div>

        {/* Big quote */}
        <div className="glass-card" style={{
          padding: '48px 56px',
          textAlign: 'center',
          marginBottom: 80,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative border stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 6,
            background: 'linear-gradient(90deg, #C1603A, #D4A843, #4AADA8)',
          }}/>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🪔</div>
          <blockquote style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: '#2C1A0E',
            maxWidth: 640,
            margin: '0 auto',
          }}>
            "No literacy. No middlemen. No barriers.
            <br/>Just her voice — and the world waiting to hear it."
          </blockquote>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 80 }}>
          <div className="section-label">The process</div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            color: '#2C1A0E',
            marginBottom: 48,
          }}>
            How <em style={{ color: '#C1603A' }}>Kahaani</em> works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            {steps.map((step, i) => (
              <div key={i} className="glass-card" style={{
                padding: 32,
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(193,96,58,0.15), rgba(232,145,58,0.15))',
                  border: '1px solid rgba(212,168,67,0.3)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      width: 22, height: 22,
                      background: 'linear-gradient(135deg, #C1603A, #E8913A)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.68rem', color: 'white', fontWeight: 700, flexShrink: 0,
                    }}>{i+1}</span>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.1rem',
                      color: '#2C1A0E',
                    }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#4A3728' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why we exist */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(193,96,58,0.08), rgba(74,173,168,0.08))',
          border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: 20,
          padding: '48px 56px',
          marginBottom: 60,
        }}>
          <div className="section-label">The problem</div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            color: '#2C1A0E',
            marginBottom: 24,
          }}>
            Why Kahaani <em style={{ color: '#C1603A' }}>needs to exist</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
            {[
              { num: '50+', label: 'living art forms kept alive almost entirely by women in India' },
              { num: '₹80/day', label: 'average earning of an Indian folk artist — below minimum wage' },
              { num: '1 art form', label: 'disappears every 3 days as artists age with no successors' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2.4rem', fontWeight: 700, color: '#C1603A', marginBottom: 8,
                }}>{stat.num}</div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#4A3728' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.4rem', fontStyle: 'italic',
            color: '#4A3728', marginBottom: 32,
          }}>
            Ready to be part of the story?
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/auth/artist')}>
              🎨 I'm an Artist
            </button>
            <button className="btn-primary" onClick={() => navigate('/auth/buyer')}
              style={{ background: 'linear-gradient(135deg, #4AADA8, #2E7D7A)' }}>
              🌏 I'm a Buyer
            </button>
          </div>
        </div>
      </main>

      {/* Rajasthani border */}
      <div style={{
        height: 12,
        background: 'repeating-linear-gradient(90deg, #C1603A 0px, #C1603A 20px, #D4A843 20px, #D4A843 40px, #4AADA8 40px, #4AADA8 60px)',
      }}/>
    </div>
  )
}
