import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BrainCircuit, Menu, X } from 'lucide-react'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/features', label: 'Features' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/blog', label: 'Blog' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
]

export default function PublicNavbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px',
      background: 'rgba(9, 9, 11, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    }}>
      {/* Brand */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          flexShrink: 0,
        }}>
          <BrainCircuit size={20} color="white" />
        </div>
        <span style={{
          fontSize: '1.1rem', fontWeight: '800',
          background: 'linear-gradient(to right, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          TradeLog AI
        </span>
      </Link>

      {/* Desktop Nav Links */}
      <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="public-nav-desktop">
        {navLinks.map(link => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.target.style.color = 'white' }}
              onMouseLeave={e => { if (!isActive) e.target.style.color = 'rgba(255,255,255,0.55)' }}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <Link to="/login" style={{
          textDecoration: 'none', padding: '7px 16px', borderRadius: '10px',
          fontSize: '0.875rem', fontWeight: '600',
          color: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'transparent',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => e.target.style.color = 'white'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
        >
          Login
        </Link>
        <Link to="/register" style={{
          textDecoration: 'none', padding: '7px 18px', borderRadius: '10px',
          fontSize: '0.875rem', fontWeight: '700',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
          transition: 'all 0.2s ease',
        }}>
          Sign Up Free
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: 'white', cursor: 'pointer', padding: '4px'
          }}
          className="public-nav-hamburger"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(9, 9, 11, 0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px',
          zIndex: 200,
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none', padding: '10px 14px', borderRadius: '10px',
                fontSize: '0.9rem', fontWeight: '500',
                color: location.pathname === link.path ? 'white' : 'rgba(255,255,255,0.6)',
                background: location.pathname === link.path ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
