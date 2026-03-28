import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AuthPage() {
  const { role } = useParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signup') // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const isArtist = role === 'artist'
  const accent = isArtist ? '#C1603A' : '#4AADA8'
  const accentGrad = isArtist
    ? 'linear-gradient(135deg, #C1603A, #E8913A)'
    : 'linear-gradient(135deg, #4AADA8, #2E7D7A)'

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // Mock auth — replace with Firebase auth
    setTimeout(() => {
      setLoading(false)
      navigate(isArtist ? '/artist' : '/buyer')
    }, 1400)
  }

  return (
    <div className="page-bg">
      <Navbar />

      <main style={{
        position: 'relative', zIndex: 5,
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64,
              background: accentGrad,
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
              margin: '0 auto 16px',
              boxShadow: `0 8px 24px ${isArtist ? 'rgba(193,96,58,0.35)' : 'rgba(74,173,168,0.35)'}`,
            }}>
              {isArtist ? '🎨' : '🌏'}
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.2rem',
              color: '#2C1A0E',
              marginBottom: 8,
            }}>
              {mode === 'signup' ? 'Join as ' : 'Welcome back, '}
              <em style={{ color: accent }}>{isArtist ? 'Artist' : 'Buyer'}</em>
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#4A3728', lineHeight: 1.6 }}>
              {isArtist
                ? 'Share your art with the world — completely free to start'
                : 'Discover and commission India\'s rarest art forms'}
            </p>
          </div>

          {/* Card */}
          <div className="glass-card" style={{ padding: '40px 40px', position: 'relative', overflow: 'hidden' }}>
            {/* Colored top border */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 5,
              background: accentGrad,
            }}/>

            {/* Mode toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(193,96,58,0.08)',
              borderRadius: 10,
              padding: 4,
              marginBottom: 28,
            }}>
              {['signup', 'login'].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.06em',
                  transition: 'all 0.2s',
                  background: mode === m ? accentGrad : 'transparent',
                  color: mode === m ? 'white' : '#4A3728',
                  boxShadow: mode === m ? '0 4px 12px rgba(193,96,58,0.25)' : 'none',
                }}>
                  {m === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A3728', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                    {isArtist ? 'Your name' : 'Full name'}
                  </label>
                  <input
                    type="text"
                    placeholder={isArtist ? 'e.g. Meena Warli' : 'e.g. Arjun Sharma'}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid rgba(212,168,67,0.3)',
                      borderRadius: 10,
                      background: 'rgba(253,246,236,0.8)',
                      fontFamily: 'Raleway, sans-serif',
                      fontSize: '0.9rem',
                      color: '#2C1A0E',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.3)'}
                  />
                </div>
              )}

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A3728', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid rgba(212,168,67,0.3)',
                    borderRadius: 10,
                    background: 'rgba(253,246,236,0.8)',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '0.9rem',
                    color: '#2C1A0E',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = accent}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.3)'}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A3728', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid rgba(212,168,67,0.3)',
                    borderRadius: 10,
                    background: 'rgba(253,246,236,0.8)',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '0.9rem',
                    color: '#2C1A0E',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = accent}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.3)'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? 'rgba(193,96,58,0.5)' : accentGrad,
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.06em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(193,96,58,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {loading
                  ? (isArtist ? '🐘 Setting up your studio...' : '🌸 Opening the marketplace...')
                  : mode === 'signup'
                    ? (isArtist ? '🎨 Start Sharing My Art' : '🌏 Discover Indian Art')
                    : 'Sign In →'}
              </button>
            </form>

            {/* Google login */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 12 }}>or continue with</div>
              <button style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                border: '1.5px solid rgba(212,168,67,0.3)',
                borderRadius: 10,
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: '#4A3728',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="Google"/>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Switch role */}
          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.86rem', color: '#4A3728' }}>
            {isArtist ? 'Looking to buy art? ' : 'Are you an artist? '}
            <span
              onClick={() => navigate(`/auth/${isArtist ? 'buyer' : 'artist'}`)}
              style={{ color: accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isArtist ? 'Browse as buyer →' : 'Join as artist →'}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
