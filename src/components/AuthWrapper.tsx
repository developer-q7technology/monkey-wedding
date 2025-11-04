import { useEffect, useState } from 'react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const WEDDING_KEY = 'monkeywedding26'

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const key = urlParams.get('key')

    if (key === WEDDING_KEY) {
      setIsAuthenticated(true)
      // Store in sessionStorage so users don't need to keep the query param
      sessionStorage.setItem('wedding_access', 'true')
    } else if (sessionStorage.getItem('wedding_access') === 'true') {
      setIsAuthenticated(true)
    }

    setIsChecking(false)
  }, [])

  if (isChecking) {
    return (
      <div className="auth-loading">
        <div className="loading-icon">
          💕
        </div>
        <p className="loading-text">
          Loading...
        </p>
        <style>{`
          .auth-loading {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, var(--accent-cream) 0%, var(--accent-pink) 100%);
            padding: 20px;
          }

          .loading-icon {
            font-size: 4em;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
          }

          .loading-text {
            font-size: 1.3em;
            color: var(--text-dark);
            font-weight: 300;
            font-family: 'Cormorant Garamond', Georgia, serif;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @media (max-width: 480px) {
            .loading-icon {
              font-size: 3em;
              margin-bottom: 15px;
            }

            .loading-text {
              font-size: 1.1em;
            }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-denied-wrapper">
        <div className="auth-denied-card">
          <div className="access-icon">
            🔒
          </div>
          <h1 className="access-title">
            Access Required
          </h1>
          <div className="access-divider"></div>
          <p className="access-message">
            Please use the invitation link to access Gabby & Leighton's wedding photos.
          </p>
          <p className="access-contact">
            If you believe you should have access, please contact the couple.
          </p>
        </div>
        <style>{`
          .auth-denied-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 40px 20px;
            background: linear-gradient(135deg, var(--accent-cream) 0%, var(--accent-pink) 100%);
            text-align: center;
          }

          .auth-denied-card {
            max-width: 600px;
            width: 100%;
            background-color: var(--white);
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: var(--shadow-lg);
            border: 1px solid rgba(212, 175, 55, 0.2);
          }

          .access-icon {
            font-size: 5em;
            margin-bottom: 25px;
          }

          .access-title {
            font-size: 2.5em;
            margin-bottom: 20px;
            color: var(--text-dark);
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-weight: 700;
          }

          .access-divider {
            width: 80px;
            height: 3px;
            background: var(--primary-color);
            margin: 0 auto 25px;
            border-radius: 2px;
          }

          .access-message {
            font-size: 1.15em;
            color: var(--text-light);
            line-height: 1.8;
            font-weight: 300;
            margin-bottom: 15px;
          }

          .access-contact {
            font-size: 0.95em;
            color: var(--text-light);
            opacity: 0.8;
            font-style: italic;
          }

          /* Tablet styles */
          @media (max-width: 768px) {
            .auth-denied-wrapper {
              padding: 30px 20px;
            }

            .auth-denied-card {
              padding: 45px 30px;
              border-radius: 18px;
            }

            .access-icon {
              font-size: 4em;
              margin-bottom: 20px;
            }

            .access-title {
              font-size: 2em;
              margin-bottom: 18px;
            }

            .access-divider {
              width: 70px;
              margin: 0 auto 20px;
            }

            .access-message {
              font-size: 1.05em;
              margin-bottom: 12px;
            }

            .access-contact {
              font-size: 0.9em;
            }
          }

          /* Mobile styles */
          @media (max-width: 480px) {
            .auth-denied-wrapper {
              padding: 20px 15px;
            }

            .auth-denied-card {
              padding: 35px 25px;
              border-radius: 15px;
            }

            .access-icon {
              font-size: 3.5em;
              margin-bottom: 18px;
            }

            .access-title {
              font-size: 1.6em;
              margin-bottom: 15px;
              line-height: 1.2;
            }

            .access-divider {
              width: 60px;
              height: 2.5px;
              margin: 0 auto 18px;
            }

            .access-message {
              font-size: 0.95em;
              line-height: 1.6;
              margin-bottom: 12px;
            }

            .access-contact {
              font-size: 0.85em;
            }
          }

          /* Extra small mobile */
          @media (max-width: 360px) {
            .auth-denied-card {
              padding: 30px 20px;
            }

            .access-icon {
              font-size: 3em;
              margin-bottom: 15px;
            }

            .access-title {
              font-size: 1.4em;
            }

            .access-message {
              font-size: 0.9em;
            }

            .access-contact {
              font-size: 0.8em;
            }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
