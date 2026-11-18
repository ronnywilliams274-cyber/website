import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/shrikhand/latin-400.css'
import '@fontsource-variable/instrument-sans'
import './styles.css'
import App from './App.jsx'
import { CartProvider } from './lib/cart.jsx'
import { applyTheme, savedThemeId } from './data/themes'

applyTheme(savedThemeId())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
)
