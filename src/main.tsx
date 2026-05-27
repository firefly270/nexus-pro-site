import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import WebVitals from './components/WebVitals'

inject({ mode: import.meta.env.DEV ? 'development' : 'production' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
        <WebVitals />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
