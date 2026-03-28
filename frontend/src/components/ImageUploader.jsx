import { useRef } from 'react'

export default function ImageUploader({ onImageSelected, imagePreview }) {
  const fileRef = useRef(null)

  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    onImageSelected(file, preview)
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {imagePreview ? (
        <div>
          <img
            src={imagePreview}
            alt="Uploaded artwork"
            style={{
              width: '100%', height: 200,
              objectFit: 'cover',
              borderRadius: 10, marginBottom: 12,
            }}
          />
          <button
            onClick={() => fileRef.current.click()}
            className="btn-outline"
            style={{ width: '100%', fontSize: '0.84rem' }}
          >
            Change Image
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current.click()}
          style={{
            width: '100%', height: 180,
            border: '2px dashed rgba(212,168,67,0.5)',
            borderRadius: 12,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(212,168,67,0.04)',
            transition: 'all 0.2s',
            gap: 12,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#C1603A'
            e.currentTarget.style.background = 'rgba(193,96,58,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(212,168,67,0.5)'
            e.currentTarget.style.background = 'rgba(212,168,67,0.04)'
          }}
        >
          <div style={{ fontSize: '2.5rem' }}>📸</div>
          <div style={{ fontSize: '0.88rem', color: '#C1603A', fontWeight: 600 }}>
            Click to upload photo of your artwork
          </div>
          <div style={{ fontSize: '0.76rem', color: '#888' }}>JPG, PNG supported</div>
        </div>
      )}
    </div>
  )
}
