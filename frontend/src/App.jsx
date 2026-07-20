import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Core App Pages
import Introduction from './pages/Introduction'
import UniversalSetup from './pages/UniversalSetup'
import PracticeChart from './pages/PracticeChart'
import DemoTrading from './pages/DemoTrading'
import Settings from './pages/Settings'

// Components
import AppNavbar from './components/AppNavbar'

// Main App Shell
function AppShell() {
  const location = useLocation()

  // Derive activeTab from current URL path
  const pathToTab = {
    '/': 'introduction',
    '/setup': 'setup',
    '/practice': 'practice',
    '/demo': 'demo',
    '/settings': 'settings',
  }
  const [activeTab, setActiveTab] = useState(pathToTab[location.pathname] || 'introduction')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AppNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{
        flex: 1,
        padding: '30px 40px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/setup" element={<UniversalSetup />} />
            <Route path="/practice" element={<PracticeChart />} />
            <Route path="/demo" element={<DemoTrading />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <BrowserRouter>
      <AppShell />
      <Analytics />
    </BrowserRouter>
  )
}

export default App

