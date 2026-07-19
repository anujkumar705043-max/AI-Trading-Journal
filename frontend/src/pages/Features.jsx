import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'

const features = [
  {
    icon: '📓',
    title: 'Intelligent Trade Journal',
    desc: 'Sirf numbers nahi — apni soch, setup, aur psychology bhi log karo. AI patterns dhundta hai tumhari history mein.',
    details: ['Screenshot attach karo', 'Entry/exit rationale likhna', 'Mood & confidence tracking', 'Multi-asset support (Stocks, Crypto, F&O)'],
  },
  {
    icon: '🤖',
    title: 'AI Trading Mentor',
    desc: 'GPT-4 powered mentor jo tumhara pura trade history padhta hai aur real, actionable feedback deta hai.',
    details: ['Pattern recognition', 'Worst trade analysis', 'Personalized improvement plan', 'Setup quality scoring'],
  },
  {
    icon: '📊',
    title: 'Pro Analytics Dashboard',
    desc: '30+ metrics ek jagah. Win rate, expectancy, max drawdown, streak analysis — sab kuch.',
    details: ['Daily/Weekly/Monthly P&L', 'Asset-wise performance', 'Time-of-day analysis', 'Risk-adjusted returns'],
  },
  {
    icon: '📈',
    title: 'Live Trading Terminal',
    desc: 'Professional-grade charts directly app ke andar. Multiple timeframes, indicators, aur drawing tools.',
    details: ['TradingView-style charts', 'Multiple indicators (RSI, MACD, BB)', 'Candlestick + Line + Heikin Ashi', 'Full-screen mode'],
  },
  {
    icon: '🔄',
    title: 'Exchange Sync',
    desc: 'Trades manually enter karne ki zaroorat nahi. Apna exchange connect karo, sab kuch auto-sync ho jata hai.',
    details: ['Binance, Coinbase support', 'Read-only API (safe)', 'Auto trade import', 'Real-time portfolio tracking'],
  },
  {
    icon: '📐',
    title: 'UTS Framework',
    desc: 'Universal Trading System — apni strategy define karo, entry/exit rules set karo, aur disciplined raho.',
    details: ['Custom rule builder', 'Pre-trade checklist', 'Setup tagging system', 'Strategy backtesting (coming soon)'],
  },
  {
    icon: '⚡',
    title: 'Risk Calculator',
    desc: 'Har trade se pehle proper position sizing calculate karo. Capital protect karo.',
    details: ['Per-trade risk %', 'Stop loss calculator', 'Position size in units', 'Account equity tracker'],
  },
  {
    icon: '🔐',
    title: 'Security & Privacy',
    desc: 'Tumhara data encrypted hai. Kabhi third party ke saath share nahi hota.',
    details: ['JWT-based auth', 'HTTPS encrypted', 'No data selling', 'Export your data anytime'],
  },
]

export default function Features() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PublicNavbar />

      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '100px',
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
          fontSize: '0.8rem', fontWeight: '600', color: '#a5b4fc', marginBottom: '24px'
        }}>
          🚀 Sab Features
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', margin: '0 0 16px',
          background: 'linear-gradient(to right, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Jo tools bade traders use karte hain
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 40px' }}>
          Ek platform mein journaling, analytics, AI guidance, aur live trading.
        </p>
        <Link to="/register" style={{
          textDecoration: 'none', padding: '14px 36px', borderRadius: '14px',
          fontWeight: '700', fontSize: '1rem',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', boxShadow: '0 8px 25px rgba(99,102,241,0.35)',
        }}>
          Free mein try karo →
        </Link>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '40px 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '20px',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              padding: '32px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', gap: '20px',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.07)'
                e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
              }}
            >
              <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.65, margin: '0 0 16px' }}>{f.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {f.details.map(d => (
                    <li key={d} style={{ fontSize: '0.8rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#6366f1' }}>›</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
