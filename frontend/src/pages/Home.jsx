import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'

const stats = [
  { value: '10,000+', label: 'Active Traders' },
  { value: '2.4M+', label: 'Trades Logged' },
  { value: '87%', label: 'Win Rate Improved' },
  { value: '₹ 0', label: 'To Start Free' },
]

const features = [
  {
    icon: '📓',
    title: 'Smart Trade Journal',
    desc: 'Har trade log karo — entry, exit, P&L, screenshots. AI automatically patterns dhundta hai.',
  },
  {
    icon: '🤖',
    title: 'AI Mentor',
    desc: 'Tumhare trading history se seekhkar personalized feedback deta hai. Galtiyon ko identify karta hai.',
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    desc: 'Win rate, risk/reward, drawdown, streak analysis — sabkuch ek dashboard pe.',
  },
  {
    icon: '📈',
    title: 'Live Trading Terminal',
    desc: 'Real-time charts aur exchange sync. Binance, Coinbase, Zerodha support.',
  },
  {
    icon: '📐',
    title: 'UTS Framework',
    desc: 'Universal Trading System — apni strategy define karo aur consistently follow karo.',
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    desc: 'Tumhara data sirf tumhara. End-to-end encrypted. Kabhi third party ke saath share nahi.',
  },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PublicNavbar />

      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '100px',
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.3)',
          fontSize: '0.8rem', fontWeight: '600', color: '#a5b4fc',
          marginBottom: '28px',
          animation: 'fadeInDown 0.6s ease',
        }}>
          ✨ AI-Powered Trading Intelligence
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          fontWeight: '900',
          lineHeight: 1.1,
          margin: '0 0 24px',
          maxWidth: '800px',
          background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Trade Smarter,<br />Not Just Harder.
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '560px',
          lineHeight: 1.7,
          margin: '0 0 44px',
        }}>
          India ka pehla AI-powered Trade Journal. Har trade log karo, AI se sikhho,
          aur apni win rate automatically improve karo.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" style={{
            textDecoration: 'none',
            padding: '16px 36px',
            borderRadius: '14px',
            fontWeight: '700',
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
            transition: 'all 0.25s ease',
          }}>
            🚀 Start Free — No Card Needed
          </Link>
          <Link to="/features" style={{
            textDecoration: 'none',
            padding: '16px 32px',
            borderRadius: '14px',
            fontWeight: '600',
            fontSize: '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            transition: 'all 0.25s ease',
          }}>
            📋 See All Features
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{
          marginTop: '60px',
          display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center',
          fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)'
        }}>
          {['🔐 SSL Secured', '⚡ Real-time Sync', '🤖 GPT-4 Powered', '📱 Mobile Friendly'].map(badge => (
            <span key={badge} style={{
              padding: '4px 12px', borderRadius: '100px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'
            }}>{badge}</span>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '60px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px', textAlign: 'center',
        }}>
          {stats.map(stat => (
            <div key={stat.label}>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '900',
                background: 'linear-gradient(135deg, #a5b4fc, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: '6px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', margin: '0 0 16px',
            background: 'linear-gradient(to right, #fff, #a5b4fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Sab kuch ek jagah
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Professional traders wale tools, ab sabke liye accessible.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              padding: '28px 28px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                e.currentTarget.style.border = '1px solid rgba(99,102,241,0.25)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
        borderTop: '1px solid rgba(99,102,241,0.15)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: '800', margin: '0 0 16px',
          color: 'white',
        }}>
          Aaj hi shuru karo — Bilkul Free
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 36px', fontSize: '1rem' }}>
          Credit card ki zaroorat nahi. 2 minute mein account banao.
        </p>
        <Link to="/register" style={{
          textDecoration: 'none',
          padding: '16px 44px',
          borderRadius: '14px',
          fontWeight: '700', fontSize: '1rem',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
        }}>
          Free Account Banao →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px', textAlign: 'center',
        color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        © 2026 TradeLog AI · Made with ❤️ for Indian Traders
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <Link to="/pricing" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Blog</Link>
          <Link to="/about" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>About</Link>
          <Link to="/contact" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </div>
  )
}
