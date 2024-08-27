import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainStage from './components/MainStage.tsx'

// Renders the MainStage as a React component.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainStage />
  </StrictMode>,
)
