import { useState, useRef } from 'react'

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'en-IN', label: 'English' },
]

export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [language, setLanguage]     = useState('hi-IN')
  const [error, setError]           = useState('')
  const recognitionRef              = useRef(null)

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome.')
      return
    }
    setError('')
    setTranscript('')
    onTranscript('')

    const recognition = new SpeechRecognition()
    recognition.continuous     = true
    recognition.interimResults = true
    recognition.lang           = language

    recognition.onresult = (e) => {
      let full = ''
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript + ' '
      }
      const cleaned = full.trim()
      setTranscript(cleaned)
      onTranscript(cleaned)
    }

    recognition.onerror = (e) => {
      setError(`Microphone error: ${e.error}. Please allow microphone access.`)
      setRecording(false)
    }

    recognition.onend = () => {
      // auto-restart if still in recording state (some browsers stop early)
      if (recognitionRef.current && recording) {
        try { recognition.start() } catch (_) {}
      }
    }

    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setRecording(false)
  }

  function clearTranscript() {
    setTranscript('')
    onTranscript('')
  }

  return (
    <div>
      {/* Language selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 8, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Speak in your language
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => !recording && setLanguage(lang.code)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                border: `1.5px solid ${language === lang.code ? '#C1603A' : 'rgba(193,96,58,0.2)'}`,
                background: language === lang.code ? 'linear-gradient(135deg, #C1603A, #E8913A)' : 'transparent',
                color: language === lang.code ? 'white' : '#4A3728',
                fontSize: '0.74rem',
                fontWeight: 600,
                fontFamily: 'Raleway, sans-serif',
                cursor: recording ? 'not-allowed' : 'pointer',
                opacity: recording && language !== lang.code ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Waveform visual */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 4, marginBottom: 20, height: 52,
      }}>
        {[12, 20, 28, 18, 34, 22, 16, 26, 20, 14, 30, 24, 18, 22, 28, 16, 20, 14, 26, 18].map((h, i) => (
          <div key={i} style={{
            width: 4,
            height: recording ? h : 6,
            background: recording
              ? 'linear-gradient(180deg, #C1603A, #E8913A)'
              : 'rgba(193,96,58,0.2)',
            borderRadius: 2,
            transition: 'height 0.3s',
            animation: recording ? `wave ${0.4 + i * 0.08}s ease-in-out infinite alternate` : 'none',
          }} />
        ))}
      </div>

      {/* Record / Stop button */}
      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          width: '100%',
          padding: '16px',
          background: recording
            ? 'linear-gradient(135deg, #9B3E20, #C1603A)'
            : 'linear-gradient(135deg, #C1603A, #E8913A)',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 700,
          fontFamily: 'Raleway, sans-serif',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          boxShadow: '0 4px 18px rgba(193,96,58,0.35)',
          animation: recording ? 'pulse 1.5s ease-in-out infinite' : 'none',
          transition: 'background 0.3s',
        }}
      >
        {recording ? '⏹ Stop Recording' : '🎙️ Start Speaking About Your Art'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(155,62,32,0.08)',
          border: '1px solid rgba(155,62,32,0.25)',
          borderRadius: 8,
          fontSize: '0.8rem', color: '#9B3E20',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Transcript display */}
      {transcript && (
        <div style={{
          marginTop: 16,
          padding: '14px 18px',
          background: 'rgba(193,96,58,0.06)',
          border: '1px solid rgba(193,96,58,0.2)',
          borderRadius: 10,
          fontSize: '0.88rem',
          color: '#4A3728',
          lineHeight: 1.7,
          fontStyle: 'italic',
          position: 'relative',
        }}>
          <div style={{ marginBottom: 8 }}>🎙️ "{transcript}"</div>
          <button
            onClick={clearTranscript}
            style={{
              fontSize: '0.72rem', color: '#C1603A',
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'Raleway, sans-serif',
              padding: 0, textDecoration: 'underline',
            }}
          >
            Clear and re-record
          </button>
        </div>
      )}

      <style>{`
        @keyframes wave { from{transform:scaleY(1)} to{transform:scaleY(1.7)} }
        @keyframes pulse {
          0%,100%{box-shadow:0 4px 18px rgba(193,96,58,0.35)}
          50%{box-shadow:0 4px 28px rgba(193,96,58,0.7)}
        }
      `}</style>
    </div>
  )
}
