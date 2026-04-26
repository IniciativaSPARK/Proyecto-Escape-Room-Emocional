import { StrictMode } from 'react'
// 
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import App from './App.jsx'

//toma el componente llamado App y 
// lo dibuja dentro del div root que
// se encuentra en el index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


