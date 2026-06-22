import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="680715338926-breq3dcjmvkh26mhv5u9pogoha760ap3.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)