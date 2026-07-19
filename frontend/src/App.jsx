import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Public Pages
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'

// Auth Pages
import Login from './pages/Login'

// Protected App Pages
import Dashboard from './pages/Dashboard'
import TradeJournal from './pages/TradeJournal'
import LiveCharts from './pages/LiveCharts'
import Settings from './pages/Settings'
import Billing from './pages/Billing'
import Mentor from './pages/Mentor'
import UTSFramework from './pages/UTSFramework'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import AppNavbar from './components/AppNavbar'

// Protected App Shell — wraps all logged-in pages
function AppShell() {
  const location = useLocation()

  // Derive activeTab from current URL path
  const pathToTab = {
    '/dashboard': 'dashboard',
    '/journal': 'journal',
    '/charts': 'charts',
    '/mentor': 'mentor',
    '/uts': 'uts',
    '/billing': 'billing',
    '/settings': 'settings',
  }
  const [activeTab, setActiveTab] = useState(pathToTab[location.pathname] || 'dashboard')

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
        <div className="animate-fade-in" style={{ flex: 1 }}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'journal' && <TradeJournal />}
          {activeTab === 'charts' && <LiveCharts />}
          {activeTab === 'mentor' && <Mentor />}
          {activeTab === 'uts' && <UTSFramework />}
          {activeTab === 'billing' && <Billing />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ===== AUTH ROUTES (already logged in? go to dashboard) ===== */}
        <Route
          path="/login"
          element={
            localStorage.getItem('token')
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />
        <Route
          path="/register"
          element={
            localStorage.getItem('token')
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uts"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: unknown routes go to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
