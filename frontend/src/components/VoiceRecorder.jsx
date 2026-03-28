import { useState, useRef } from 'react'

export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'hi-IN'

    recognition.onresult = (e) => {
      let full = ''
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript
      }
      setTranscript(full)
      onTranscript(full)
    }

    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  return (
    <div>
      {/* Waveform visual */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 4, marginBottom: 20, height: 48,
      }}>
        {[12,20,28,18,34,22,16,26,20,14,30,24,18,22,28,16,20,14,26,18].map((h, i) => (
          <div key={i} style={{
            width: 4,
            height: recording ? h : 6,
            background: recording
              ? 'linear-gradient(180deg, #C1603A, #E8913A)'
              : 'rgba(193,96,58,0.2)',
            borderRadius: 2,
            transition: 'height 0.3s',
            animation: recording ? `wave ${0.4 + i * 0.08}s ease-in-out infinite alternate` : 'none',
          }}/>
        ))}
      </div>

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
        }}
      >
        {recording ? '⏹ Stop Recording' : '🎙️ Start Speaking About Your Art'}
      </button>

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
        }}>
          🎙️ "{transcript}"
        </div>
      )}

      <style>{`
        @keyframes wave { from{transform:scaleY(1)} to{transform:scaleY(1.7)} }
        @keyframes pulse { 0%,100%{box-shadow:0 4px 18px rgba(193,96,58,0.35)} 50%{box-shadow:0 4px 28px rgba(193,96,58,0.7)} }
      `}</style>
    </div>
  )
}
