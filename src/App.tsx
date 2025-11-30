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
          <h1>Gabrielle & Leighton</h1>
          <p className="date">Friday 12th December 2025</p>
        </header>

        <main className="main-content">
          <section className="upload-section">
            <h2>Share Your Photos</h2>
            <p>We'd love to see the day through your eyes!</p>
            <PhotoUpload onUploadComplete={handleUploadComplete} />
          </section>

          <section className="gallery-section">
            <h2>Gallery</h2>
            <PhotoGallery refreshTrigger={refreshTrigger} />
          </section>
        </main>
      </div>
    </AuthWrapper>
  )
}

export default App
