import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface PhotoUploadProps {
  onUploadComplete: () => void
}

export default function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(`Uploading 0/${files.length} photos...`)

    const fileArray = Array.from(files)
    let successCount = 0

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]

      // Only allow image files
      if (!file.type.startsWith('image/')) {
        continue
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      try {
        const { error } = await supabase.storage
          .from('wedding-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error
        successCount++
        setUploadProgress(`Uploading ${i + 1}/${files.length} photos...`)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    setUploading(false)
    setUploadProgress(`Successfully uploaded ${successCount} photo(s)!`)

    setTimeout(() => {
      setUploadProgress('')
      onUploadComplete()
    }, 2000)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(e.target.files)
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="photo-upload-dropzone"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="upload-icon">
            📷
          </div>
          <p className="upload-title">
            {dragActive ? '✨ Drop your photos here!' : 'Click or drag photos to upload'}
          </p>
          <p className="upload-subtitle">
            You can select multiple photos at once
          </p>
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: dragActive
            ? 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
            : 'none',
          pointerEvents: 'none',
          transition: 'all 0.4s ease'
        }}></div>
      </div>
      {uploading && (
        <div className="upload-status uploading">
          <p>
            ⏳ {uploadProgress}
          </p>
        </div>
      )}
      {!uploading && uploadProgress && (
        <div className="upload-status success">
          <p>
            ✅ {uploadProgress}
          </p>
        </div>
      )}
      <style>{`
        .photo-upload-dropzone {
          border: 2px dashed var(--primary-light);
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          background-color: var(--accent-cream);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .photo-upload-dropzone:hover {
          transform: scale(1.01);
          box-shadow: var(--shadow-md);
        }

        .upload-icon {
          font-size: 3em;
          margin-bottom: 15px;
          color: var(--primary-color);
        }

        .upload-title {
          font-size: 1.3em;
          margin-bottom: 12px;
          color: var(--text-dark);
          font-weight: 500;
        }

        .upload-subtitle {
          font-size: 0.95em;
          color: var(--text-light);
          font-weight: 300;
        }

        .upload-status {
          margin-top: 25px;
          padding: 15px;
          border-radius: 10px;
        }

        .upload-status.uploading {
          background-color: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--primary-light);
        }

        .upload-status.uploading p {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 1.05em;
        }

        .upload-status.success {
          background-color: rgba(74, 222, 128, 0.1);
          border: 1px solid #4ade80;
          animation: fadeIn 0.5s ease;
        }

        .upload-status.success p {
          color: #16a34a;
          font-weight: 600;
          font-size: 1.05em;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .photo-upload-dropzone {
            padding: 40px 25px;
            border-radius: 12px;
          }

          .upload-icon {
            font-size: 2.5em;
            margin-bottom: 12px;
          }

          .upload-title {
            font-size: 1.1em;
            margin-bottom: 10px;
          }

          .upload-subtitle {
            font-size: 0.85em;
          }

          .upload-status {
            margin-top: 20px;
            padding: 12px;
          }

          .upload-status p {
            font-size: 0.95em !important;
          }
        }

        @media (max-width: 480px) {
          .photo-upload-dropzone {
            padding: 30px 20px;
            border-radius: 10px;
          }

          .upload-icon {
            font-size: 2em;
            margin-bottom: 10px;
          }

          .upload-title {
            font-size: 1em;
            margin-bottom: 8px;
            line-height: 1.4;
          }

          .upload-subtitle {
            font-size: 0.8em;
            line-height: 1.4;
          }

          .upload-status {
            margin-top: 15px;
            padding: 10px;
          }

          .upload-status p {
            font-size: 0.9em !important;
          }
        }
      `}</style>
    </div>
  )
}
