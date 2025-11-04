import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Photo {
  name: string
  url: string
}

interface PhotoGalleryProps {
  refreshTrigger: number
}

export default function PhotoGallery({ refreshTrigger }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from('wedding-photos')
        .list('', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) throw error

      const photoUrls = data.map((file) => {
        const { data: urlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(file.name)

        return {
          name: file.name,
          url: urlData.publicUrl
        }
      })

      setPhotos(photoUrls)
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div style={{
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '3em',
          marginBottom: '20px',
          animation: 'pulse 2s infinite'
        }}>
          💕
        </div>
        <p style={{
          fontSize: '1.2em',
          color: 'var(--text-light)',
          fontWeight: 300
        }}>
          Loading photos...
        </p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div style={{
        padding: '80px 40px',
        textAlign: 'center',
        backgroundColor: 'var(--white)',
        borderRadius: '20px',
        margin: '0 20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          fontSize: '4em',
          marginBottom: '20px'
        }}>
          📸
        </div>
        <p style={{
          fontSize: '1.3em',
          color: 'var(--text-dark)',
          fontWeight: 500,
          marginBottom: '10px'
        }}>
          No photos yet!
        </p>
        <p style={{
          fontSize: '1em',
          color: 'var(--text-light)',
          fontWeight: 300
        }}>
          Be the first to share a memory from our special day
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          padding: '0 20px 20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.name}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: '12px',
              aspectRatio: '1',
              backgroundColor: 'var(--accent-cream)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: `fadeInUp 0.6s ease ${index * 0.05}s both`,
              border: '3px solid var(--white)',
              position: 'relative' as const
            }}
            onClick={() => setSelectedPhoto(photo.url)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }}
          >
            <img
              src={photo.url}
              alt="Wedding photo"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}></div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            animation: 'fadeIn 0.3s ease',
            padding: '20px'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Wedding photo fullscreen"
            style={{
              maxWidth: '95%',
              maxHeight: '95%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              animation: 'zoomIn 0.3s ease'
            }}
          />
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '2.5em',
              background: 'var(--primary-color)',
              border: 'none',
              color: 'var(--white)',
              cursor: 'pointer',
              padding: '5px 18px',
              borderRadius: '50%',
              lineHeight: '1',
              transition: 'all 0.3s ease',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={() => setSelectedPhoto(null)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'
              e.currentTarget.style.backgroundColor = 'var(--primary-dark)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0) scale(1)'
              e.currentTarget.style.backgroundColor = 'var(--primary-color)'
            }}
          >
            ×
          </button>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            gap: 15px !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </>
  )
}
