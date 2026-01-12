import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ShopContextProvider } from './Context/ShopContext.jsx'
import { AuthProvider } from './Context/Authcontex.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <ShopContextProvider>
    <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
  </ShopContextProvider>
  </AuthProvider>
)
