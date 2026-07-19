import { useState } from 'react'
import { CreditCard, Check, Sparkles, X, ShieldCheck } from 'lucide-react'

export default function Billing() {
  const [activePlan, setActivePlan] = useState('Free')
  const [checkoutPlan, setCheckoutPlan] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'Essential logging for retail manual traders.',
      features: [
        'Standard Trade Journaling',
        'Manual screenshot uploads',
        'Basic statistics calculations',
        '1 Exchange API sync connection'
      ],
      cta: 'Current Plan'
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      desc: 'Advanced insights and full API automation.',
      features: [
        'Unlimited Trades & Logs',
        'Advanced AI Trading Coach',
        'Binance, Bybit, OKX integrations',
        'Live TradingView custom setups',
        'Actionable Weekly Improvement Plans'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      desc: 'For professional prop firms and fund managers.',
      features: [
        'Everything in Pro plan',
        'API strategy simulators (Upcoming)',
        'Priority execution support',
        'Custom risk manager alerts',
        'Automated reports email digests'
      ],
      cta: 'Contact Enterprise'
    }
  ]

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setPaymentSuccess(true)
      setActivePlan(checkoutPlan.name)
      setTimeout(() => {
        setCheckoutPlan(null)
        setPaymentSuccess(false)
      }, 2000)
    }, 1500)
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreditCard size={36} style={{ color: 'var(--accent-color)' }} />
          SaaS Billing & Plans
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your active subscriptions, change plans, or set payment methods.</p>
      </div>

      {/* Plans grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
        {plans.map((p, idx) => {
          const isActive = activePlan === p.name
          return (
            <div key={idx} className="glass-panel" style={{
              padding: '35px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: isActive ? '2px solid var(--accent-color)' : p.popular ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
              boxShadow: p.popular ? '0 10px 40px rgba(99, 102, 241, 0.15)' : 'none'
            }}>
              {p.popular && (
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, var(--accent-color), #4f46e5)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Sparkles size={12} /> Most Popular
                </span>
              )}

              <div>
                <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.4rem' }}>{p.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 24px 0', lineHeight: '1.4' }}>{p.desc}</p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{p.price}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/ {p.period}</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginBottom: '30px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', marginBottom: '12px', color: 'white' }}>What's Included:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {p.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <Check size={14} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (isActive || p.name === 'Free') return
                  setCheckoutPlan(p)
                }}
                className={`btn ${isActive ? 'outline' : ''}`} 
                style={{ width: '100%', padding: '12px' }}
                disabled={isActive}
              >
                {isActive ? 'Current Active Plan' : p.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Checkout modal overlay (Stripe/Razorpay mockup) */}
      {checkoutPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '450px',
            padding: '35px',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button 
              onClick={() => setCheckoutPlan(null)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                  margin: '0 auto 20px auto'
                }}>
                  <ShieldCheck size={36} />
                </div>
                <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>Upgrade Successful!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Thank you! You are now subscribed to the <strong>{checkoutPlan.name}</strong> tier.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>Razorpay Secure Checkout</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Upgrading to {checkoutPlan.name} plan - <strong>{checkoutPlan.price}/mo</strong>
                  </p>
                </div>

                <div className="input-group">
                  <label>Cardholder Name</label>
                  <input required className="input-field" placeholder="John Doe" />
                </div>

                <div className="input-group">
                  <label>Card Number</label>
                  <input required className="input-field" placeholder="4111 2222 3333 4444" maxLength="19" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input required className="input-field" placeholder="MM/YY" maxLength="5" />
                  </div>
                  <div className="input-group">
                    <label>CVV / CVN</label>
                    <input required type="password" className="input-field" placeholder="•••" maxLength="3" />
                  </div>
                </div>

                <button type="submit" className="btn" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={submitting}>
                  {submitting ? 'Verifying payment...' : `Pay ${checkoutPlan.price}.00`}
                </button>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  🔒 256-bit SSL encrypted connection. All mock transactions are secure.
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
