import { useState, useRef } from 'react'

export default function ImageRestoration({ imageSrc }) {
  const [sliderPos, setSliderPos] = useState(50)
  const wrapRef = useRef(null)
  const dragging = useRef(false)

  function onMouseDown() { dragging.current = true }
  function onMouseUp() { dragging.current = false }
  function onMouseMove(e) {
    if (!dragging.current || !wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const pct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }
  function onTouchMove(e) {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const pct = Math.max(5, Math.min(95, ((e.touches[0].clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }

  return (
    <div>
      <div
        ref={wrapRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        style={{
          position: 'relative', width: '100%', height: 260,
          borderRadius: 14, overflow: 'hidden',
          cursor: 'ew-resize',
          background: '#e0cdb5',
          userSelect: 'none',
        }}
      >
        {/* BEFORE */}
        <div style={{
          position: 'absolute', inset: 0,
          background: imageSrc
            ? `url(${imageSrc}) center/cover no-repeat`
            : 'linear-gradient(135deg, #c4a882, #a0826a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: 'brightness(0.7) saturate(0.5)',
        }}>
          {!imageSrc && (
            <div style={{ textAlign: 'center', color: 'white', opacity: 0.7 }}>
              <div style={{ fontSize: '2.5rem' }}>🖼️</div>
              <div style={{ fontSize: '0.8rem', marginTop: 8 }}>Original photo</div>
            </div>
          )}
        </div>

        {/* AFTER (clipped) */}
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          background: imageSrc
            ? `url(${imageSrc}) center/cover no-repeat`
            : 'linear-gradient(135deg, #FDF6EC, #F5E8D0)',
          filter: 'brightness(1.15) saturate(1.4) contrast(1.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {!imageSrc && (
            <div style={{ textAlign: 'center', color: '#4A3728' }}>
              <div style={{ fontSize: '2.5rem' }}>✨</div>
              <div style={{ fontSize: '0.8rem', marginTop: 8, fontWeight: 600 }}>AI Enhanced</div>
            </div>
          )}
        </div>

        {/* Slider divider line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: sliderPos + '%',
          width: 2,
          background: '#D4A843',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}>
          {/* Handle */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 38, height: 38,
            background: '#D4A843',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            pointerEvents: 'all',
            cursor: 'ew-resize',
          }}>◀▶</div>
        </div>

        {/* Labels */}
        <div style={{
          position: 'absolute', bottom: 10, left: 14,
          fontSize: '0.72rem', color: 'white', fontWeight: 700,
          background: 'rgba(0,0,0,0.45)', padding: '2px 8px', borderRadius: 4,
          pointerEvents: 'none',
        }}>BEFORE</div>
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontSize: '0.72rem', color: '#C1603A', fontWeight: 700,
          background: 'rgba(255,255,255,0.88)', padding: '2px 8px', borderRadius: 4,
          pointerEvents: 'none',
        }}>AI ENHANCED</div>
      </div>

      {/* Caption */}
      <div style={{
        marginTop: 10, fontSize: '0.76rem',
        color: '#888', textAlign: 'center',
      }}>
        Drag the slider to compare original vs AI-restored image
      </div>
    </div>
  )
}
