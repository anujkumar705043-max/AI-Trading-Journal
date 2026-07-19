import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import TradeJournal from './pages/TradeJournal'
import LiveCharts from './pages/LiveCharts'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Billing from './pages/Billing'
import Mentor from './pages/Mentor'
import UTSFramework from './pages/UTSFramework'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [activeTab, setActiveTab] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'journal', label: 'Trade History', icon: '📓' },
    { id: 'charts', label: 'Trading Terminal', icon: '📈' },
    { id: 'mentor', label: 'AI Mentor', icon: '👨‍🏫' },
    { id: 'uts', label: 'UTS Framework', icon: '📐' },
    { id: 'billing', label: 'SaaS Billing', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return <Login onLoginSuccess={(t) => setToken(t)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      
      {/* Sticky Horizontal Top Navigation Bar */}
      <header className="glass-panel" style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        margin: '14px 20px 0 20px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Left Side: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)'
          }}>
            🤖
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CRYPTO TRADE लोक
          </span>
        </div>

        {/* Center: Horizontal Navigation Menu */}
        <nav style={{ display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', padding: '4px 0' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                  borderRadius: '12px',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right Side: Status and Log Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            System Status: <span style={{ color: 'var(--success)' }}>● Online</span>
          </div>
          <button 
            onClick={handleLogout}
            className="btn outline" 
            style={{ 
              padding: '6px 14px', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            🚪 Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
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

export default App
