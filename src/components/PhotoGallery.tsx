import { useState, useEffect, useCallback } from 'react'
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

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

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }, [selectedIndex])

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }, [selectedIndex, photos.length])

  const closeModal = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'Escape':
          closeModal()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, goToPrevious, goToNext, closeModal])

  if (loading) {
    return (
      <div style={{
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '1.1em',
          color: 'var(--text-light)',
          fontStyle: 'italic'
        }}>
          Loading photos...
        </p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div style={{
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '1.1em',
          color: 'var(--text-light)',
          fontStyle: 'italic'
        }}>
          No photos yet - be the first to share a memory!
        </p>
      </div>
    )
  }

  // Create masonry-like layout with varying sizes
  const getItemStyle = (index: number) => {
    const pattern = index % 10
    // Create an interesting pattern: some tall, some wide, some regular
    if (pattern === 0 || pattern === 6) {
      return { gridRow: 'span 2' } // Tall
    } else if (pattern === 3 || pattern === 8) {
      return { gridColumn: 'span 2' } // Wide
    }
    return {} // Regular
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gridAutoRows: '200px',
          gridAutoFlow: 'dense',
          gap: '12px',
          padding: '0 0 20px'
        }}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.name}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              transition: 'all 0.3s ease',
              animation: `fadeInUp 0.5s ease ${index * 0.03}s both`,
              position: 'relative',
              ...getItemStyle(index)
            }}
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            <img
              src={photo.url}
              alt="Wedding photo"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
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
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={closeModal}
        >
          {/* Previous button */}
          {selectedIndex > 0 && (
            <button
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2em',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                padding: '15px 20px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                zIndex: 1001
              }}
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              ‹
            </button>
          )}

          {/* Next button */}
          {selectedIndex < photos.length - 1 && (
            <button
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2em',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                padding: '15px 20px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                zIndex: 1001
              }}
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              ›
            </button>
          )}

          {/* Close button */}
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '1.5em',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '10px',
              transition: 'all 0.2s ease',
              zIndex: 1001
            }}
            onClick={closeModal}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
            }}
          >
            ✕
          </button>

          {/* Photo counter */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9em',
              fontFamily: 'Georgia, serif'
            }}
          >
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Main image */}
          <img
            src={photos[selectedIndex].url}
            alt="Wedding photo fullscreen"
            style={{
              maxWidth: '85%',
              maxHeight: '85%',
              objectFit: 'contain',
              animation: 'zoomIn 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 150px !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 120px !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </>
  )
}
