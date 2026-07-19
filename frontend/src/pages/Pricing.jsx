import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    badge: null,
    description: 'Basic journaling ke liye perfect',
    color: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    buttonStyle: {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      color: 'white',
    },
    features: [
      '✅ 50 trades per month',
      '✅ Basic Dashboard',
      '✅ Trade Journal',
      '✅ Simple P&L Stats',
      '❌ AI Mentor',
      '❌ Advanced Analytics',
      '❌ Exchange Sync',
      '❌ Live Charts',
    ],
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    badge: '🔥 Most Popular',
    description: 'Serious traders ke liye sab kuch',
    color: 'rgba(99,102,241,0.08)',
    borderColor: 'rgba(99,102,241,0.4)',
    buttonStyle: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(99,102,241,0.35)',
    },
    features: [
      '✅ Unlimited trades',
      '✅ Advanced Dashboard',
      '✅ Smart Trade Journal',
      '✅ Full Analytics & Charts',
      '✅ AI Mentor (GPT-4)',
      '✅ Exchange Sync',
      '✅ Risk Calculator',
      '✅ Priority Support',
    ],
  },
  {
    name: 'Team',
    price: '₹1999',
    period: '/month',
    badge: null,
    description: 'Trading desks aur prop firms ke liye',
    color: 'rgba(139,92,246,0.06)',
    borderColor: 'rgba(139,92,246,0.25)',
    buttonStyle: {
      background: 'rgba(139,92,246,0.15)',
      border: '1px solid rgba(139,92,246,0.4)',
      color: '#c4b5fd',
    },
    features: [
      '✅ Everything in Pro',
      '✅ Up to 10 team members',
      '✅ Team Performance Dashboard',
      '✅ Shared Trade Setups',
      '✅ Admin Controls',
      '✅ Dedicated Account Manager',
      '✅ Custom Branding (coming soon)',
      '✅ API Access',
    ],
  },
]

export default function Pricing() {
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
          💳 Simple, Transparent Pricing
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', margin: '0 0 16px',
          background: 'linear-gradient(to right, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Apna Plan Chuno
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
          Free se shuru karo, jab ready ho tab upgrade karo. No hidden fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '24px', alignItems: 'stretch',
        }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              padding: '36px 32px',
              borderRadius: '24px',
              background: plan.color,
              border: `1px solid ${plan.borderColor}`,
              display: 'flex', flexDirection: 'column', gap: '24px',
              position: 'relative',
              transition: 'transform 0.25s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  fontSize: '0.78rem', fontWeight: '700', color: 'white',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                }}>
                  {plan.badge}
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: '900', color: 'white' }}>{plan.price}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{plan.period}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '6px' }}>{plan.description}</div>
              </div>

              <Link to="/register" style={{
                textDecoration: 'none', padding: '13px', borderRadius: '12px',
                fontWeight: '700', fontSize: '0.9rem', textAlign: 'center',
                transition: 'opacity 0.2s ease',
                ...plan.buttonStyle,
              }}>
                {plan.name === 'Free' ? 'Start Free' : `Get ${plan.name}`} →
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{
                    fontSize: '0.875rem',
                    color: f.startsWith('❌') ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.75)',
                  }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', margin: '0 0 16px' }}>Koi sawaal?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
            Kisi bhi plan ke bare mein confuse ho to contact karo.
          </p>
          <Link to="/contact" style={{
            textDecoration: 'none', padding: '12px 28px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '0.9rem',
          }}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
