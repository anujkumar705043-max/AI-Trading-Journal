import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'

const articles = [
  {
    tag: 'UTS Framework',
    title: 'Universal Trading System — Disciplined Trading ka Blueprint',
    desc: 'Har successful trader ke paas ek system hota hai. Bina system ke trading sirf gambling hai. Is article mein main tumhe UTS Framework explain karta hoon jo main khud use karta hoon.',
    readTime: '8 min read',
    date: 'Jan 15, 2026',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  {
    tag: 'Trade Psychology',
    title: 'Loss ke baad kya karna chahiye — Trader ki Psychology',
    desc: 'Ek bada loss aane ke baad zyada se zyada paise banana chahte ho? Ye revenge trading hai aur ye tumhe barbad karega. Ye article tumhari psychology fix karega.',
    readTime: '5 min read',
    date: 'Feb 3, 2026',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    tag: 'Setup Quality',
    title: 'A+ Setup vs B-Grade Setup — Farak kaise pehchanein?',
    desc: 'Sirf har candle pe trade nahi karna chahiye. High-quality setups identify karna aur wait karna hi professional trading hai. Seekho kaise.',
    readTime: '6 min read',
    date: 'Feb 20, 2026',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
  },
  {
    tag: 'Risk Management',
    title: 'Position Sizing — Capital kyun kabhi blow nahi hogi',
    desc: '2% rule kya hai aur kyun ye itni important hai? Ek simple formula jo tumhara account hamesha protect karega, chahe 10 consecutive losses bhi ho jayein.',
    readTime: '7 min read',
    date: 'Mar 5, 2026',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
]

export default function Blog() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PublicNavbar />

      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '100px',
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
          fontSize: '0.8rem', fontWeight: '600', color: '#6ee7b7', marginBottom: '24px'
        }}>
          ✍️ Trading Blog & Setups
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', margin: '0 0 16px',
          background: 'linear-gradient(to right, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Seekho, Samjho, Execute karo
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
          Real traders ke liye real knowledge. Psychology, setups, risk management — sab ek jagah.
        </p>
      </section>

      {/* Articles Grid */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {articles.map((article, i) => (
            <div key={i} style={{
              padding: '32px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', gap: '24px', alignItems: 'flex-start',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.06)'
                e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)'
                e.currentTarget.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              {/* Color Accent Bar */}
              <div style={{
                width: '4px', minHeight: '80px', borderRadius: '4px',
                background: article.gradient, flexShrink: 0,
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '100px',
                    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                    fontSize: '0.75rem', fontWeight: '600', color: '#a5b4fc',
                  }}>
                    {article.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                    {article.date} · {article.readTime}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {article.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
                  {article.desc}
                </p>
              </div>

              <div style={{
                flexShrink: 0, fontSize: '1.4rem',
                color: 'rgba(255,255,255,0.15)',
                alignSelf: 'center',
              }}>→</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '60px', padding: '40px', borderRadius: '20px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.15)',
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', margin: '0 0 12px' }}>
            Apna khud ka journal start karo
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.45)', margin: '0 0 24px', fontSize: '0.9rem' }}>
            Reading se sikhna theek hai. Apna data dekhna aur bhi better hai.
          </p>
          <Link to="/register" style={{
            textDecoration: 'none', padding: '12px 32px', borderRadius: '12px',
            fontWeight: '700', fontSize: '0.9rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
          }}>
            Free Account Banao
          </Link>
        </div>
      </section>
    </div>
  )
}
