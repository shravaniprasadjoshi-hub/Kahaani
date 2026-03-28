import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ role }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header style={{
      position: 'relative', zIndex: 10,
      padding: '24px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(212,168,67,0.2)',
    }}>
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: 44, height: 44,
          background: 'linear-gradient(135deg, #C1603A, #E8913A)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem',
          boxShadow: '0 4px 16px rgba(193,96,58,0.35)',
        }}>🪔</div>
        <div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.8rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #C1603A 30%, #D4A843)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Kahaani</div>
          <div style={{
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            color: '#4AADA8',
            textTransform: 'uppercase',
            marginTop: -2,
          }}>Where her story meets the world</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {[
          { label: 'Home', path: '/' },
          { label: 'About', path: '/about' },
        ].map(link => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: location.pathname === link.path ? '#C1603A' : '#4A3728',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
          >{link.label}</span>
        ))}

        {!role && (
          <>
            <button className="btn-outline" onClick={() => navigate('/auth/artist')}
              style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
              For Artists
            </button>
            <button className="btn-primary" onClick={() => navigate('/auth/buyer')}
              style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
              Discover Art
            </button>
          </>
        )}

        {role === 'artist' && (
          <span style={{ fontSize: '0.82rem', color: '#4AADA8', fontWeight: 600 }}>
            🎨 Artist Dashboard
          </span>
        )}
        {role === 'buyer' && (
          <span style={{ fontSize: '0.82rem', color: '#4AADA8', fontWeight: 600 }}>
            🌏 Buyer Dashboard
          </span>
        )}
      </nav>
    </header>
  )
}
