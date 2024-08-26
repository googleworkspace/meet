import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Setup from './components/Setup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Setup />
  </StrictMode>,
)