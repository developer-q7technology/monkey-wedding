import { useState } from 'react'
import AuthWrapper from './components/AuthWrapper'
import PhotoUpload from './components/PhotoUpload'
import PhotoGallery from './components/PhotoGallery'
import './App.css'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <AuthWrapper>
      <div className="app">
        <header className="header">
          <h1>Gabby & Leighton's Big Day</h1>
          <div className="divider"></div>
          <p>Share your favorite moments from our special day!</p>
        </header>

        <main className="main-content">
          <section className="upload-section">
            <h2>Upload Your Photos</h2>
            <PhotoUpload onUploadComplete={handleUploadComplete} />
          </section>

          <section className="gallery-section">
            <h2>Our Wedding Gallery</h2>
            <PhotoGallery refreshTrigger={refreshTrigger} />
          </section>
        </main>
      </div>
    </AuthWrapper>
  )
}

export default App
