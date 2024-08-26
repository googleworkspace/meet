import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Game from './components/Game.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Game />
  </StrictMode>,
)