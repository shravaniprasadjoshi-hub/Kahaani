import womanImg from '../assets/woman_artist.png'
function RajasthaniWoman() {
  return (
    <img
        src={womanImg}
        style={{
            position: 'fixed',
            right: 0,
            bottom: -10,
            width: 340,
            opacity: 0.25,
            zIndex: 6,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))'
        }}
    />
  )
}

// Peacock SVG decoration
function Peacock({ style }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: 80, height: 80, opacity: 0.12, position: 'fixed', ...style }}>
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
    <svg viewBox="0 0 200 200" style={{ width: size, height: size, zIndex: 2, position: 'fixed', ...style }}>
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

export default function GlobalDecor() {
  return (
    <>
      <Mandala size={440} style={{ top: -120, right: -120, opacity: 0.12, zIndex: 1, animation: 'rotateSlow 60s linear infinite' }}/>
      <Mandala size={380} style={{ bottom: -100, left: -100, opacity: 0.05, animation: 'rotateSlow 80s linear infinite reverse' }}/>
      <Peacock style={{ top: 20, right: 20 }}/>
      <Peacock style={{ bottom: 40, left: 10 }}/>
    </>
  )
}