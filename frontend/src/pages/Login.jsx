import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { BrainCircuit, Key, Mail, Sparkles } from 'lucide-react'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', isError: false })

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextPath = searchParams.get('next') || '/dashboard'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setMsg({ text: 'Please fill in all fields.', isError: true })
      return
    }

    setLoading(true)
    setMsg({ text: '', isError: false })

    const endpoint = isRegister ? '/auth/register' : '/auth/login'

    fetch(`https://ai-trading-journal-m373.onrender.com${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.detail || 'Authentication failed') })
        }
        return res.json()
      })
      .then(data => {
        setLoading(false)
        if (isRegister) {
          setMsg({ text: 'Registration successful! Abhi login karo.', isError: false })
          setIsRegister(false)
          setPassword('')
        } else {
          localStorage.setItem('token', data.access_token)
          // Redirect to ?next= path or dashboard
          navigate(nextPath, { replace: true })
        }
      })
      .catch(err => {
        console.error(err)
        setMsg({ text: err.message, isError: true })
        setLoading(false)
      })
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'radial-gradient(circle at top right, #1e1b4b, #09090b)',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Back to Home link */}
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '24px',
        textDecoration: 'none', color: 'rgba(255,255,255,0.4)',
        fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'color 0.2s ease',
      }}
        onMouseEnter={e => e.target.style.color = 'white'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
      >
        ← Home
      </Link>

      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)'
          }}>
            <BrainCircuit size={36} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'white' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            {isRegister ? 'Start your AI-powered Trading Journal' : 'Login to access your trading dashboard'}
          </p>
        </div>

        {msg.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            background: msg.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${msg.isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: msg.isError ? 'var(--danger)' : 'var(--success)'
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Key size={14} /> Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn" style={{ padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            {loading ? 'Processing...' : (
              <>
                <Sparkles size={16} />
                {isRegister ? 'Sign Up' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setMsg({ text: '', isError: false })
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-color)',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  )
}
