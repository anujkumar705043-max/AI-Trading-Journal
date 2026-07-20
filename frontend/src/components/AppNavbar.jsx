import { BrainCircuit } from 'lucide-react'

const navItems = [
  { id: 'introduction', label: 'Introduction', icon: '🎯' },
  { id: 'setup', label: 'Universal Setup', icon: '📐' },
  { id: 'practice', label: 'Practice Chart', icon: '📝' },
  { id: 'demo', label: 'Demo Trading', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function AppNavbar({ activeTab, onTabChange }) {
  return (
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
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
        }}>
          <BrainCircuit size={20} color="white" />
        </div>
        <span style={{
          fontSize: '1.1rem', fontWeight: '800',
          background: 'linear-gradient(to right, #fff, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Trading Setup
        </span>
      </div>

      {/* Center: Nav Items */}
      <nav style={{ display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', padding: '4px 0' }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))'
                  : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                borderRadius: '12px',
                color: isActive ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Right: Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)'
        }}>
          System Status: <span style={{ color: 'var(--success)' }}>● Online</span>
        </div>
      </div>
    </header>
  )
}
