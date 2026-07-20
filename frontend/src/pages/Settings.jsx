import React, { useState, useEffect } from 'react'
import { User, Moon, Sun, Save, CheckCircle } from 'lucide-react'

export default function Settings() {
  const [theme, setTheme] = useState('dark')
  const [profile, setProfile] = useState({
    name: 'Trader',
    email: 'trader@example.com',
    experience: 'Beginner'
  })
  const [saved, setSaved] = useState(false)

  // Just a visual toggle for the demo, since full theme switching requires CSS variable updates
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    if (newTheme === 'white') {
      document.body.style.setProperty('--bg-dark', '#ffffff')
      document.body.style.setProperty('--text-primary', '#111827')
      document.body.style.setProperty('--text-secondary', '#4b5563')
    } else {
      document.body.style.setProperty('--bg-dark', '#0a0d12')
      document.body.style.setProperty('--text-primary', '#ffffff')
      document.body.style.setProperty('--text-secondary', '#8B93A3')
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and application preferences.</p>
      </div>

      {/* Theme Settings */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          Theme Preference
        </h2>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => handleThemeChange('dark')}
            style={{
              flex: 1, padding: '20px', borderRadius: '12px',
              background: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              border: theme === 'dark' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
            }}
          >
            <Moon size={32} color={theme === 'dark' ? '#8b5cf6' : 'var(--text-secondary)'} />
            <span style={{ fontWeight: theme === 'dark' ? 'bold' : 'normal' }}>Dark Mode</span>
          </button>
          
          <button 
            onClick={() => handleThemeChange('white')}
            style={{
              flex: 1, padding: '20px', borderRadius: '12px',
              background: theme === 'white' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              border: theme === 'white' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
            }}
          >
            <Sun size={32} color={theme === 'white' ? '#f59e0b' : 'var(--text-secondary)'} />
            <span style={{ fontWeight: theme === 'white' ? 'bold' : 'normal' }}>Light (White) Mode</span>
          </button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} />
            Profile Details
          </h2>
          {saved && (
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <CheckCircle size={16} /> Saved Successfully
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Trading Experience</label>
            <select
              value={profile.experience}
              onChange={(e) => setProfile({...profile, experience: e.target.value})}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <button 
            onClick={handleSave}
            style={{
              alignSelf: 'flex-start',
              padding: '12px 24px', borderRadius: '8px',
              background: '#8b5cf6', color: 'white', border: 'none',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              fontWeight: 'bold', marginTop: '10px'
            }}
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}
