import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SidePanel from './components/SidePanel.tsx'

// Renders the SidePanel as a React component.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidePanel />
  </StrictMode>,
)
