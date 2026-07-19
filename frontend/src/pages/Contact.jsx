import { useState } from 'react'
import PublicNavbar from '../components/PublicNavbar'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, connect to backend API
    setTimeout(() => setSent(true), 400)
  }

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
          📬 Get in Touch
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900', margin: '0 0 16px',
          background: 'linear-gradient(to right, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Baat karo humse
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '450px', margin: '0 auto' }}>
          Feature request, bug report, ya bas koi sawaal — hum 24 ghante mein reply karte hain.
        </p>
      </section>

      {/* Main Content */}
      <section style={{
        padding: '0 24px 100px', maxWidth: '900px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px', alignItems: 'start',
      }}>

        {/* Contact Form */}
        <div style={{
          padding: '36px', borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: 'white', fontWeight: '700', margin: '0 0 8px' }}>Message mil gaya!</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
                Hum jaldi reply karenge.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                style={{
                  marginTop: '16px', padding: '10px 24px', borderRadius: '10px',
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#a5b4fc', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem',
                }}
              >
                Naya message bhejo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'white', margin: 0 }}>Message bhejo</h2>

              {[
                { key: 'name', label: 'Tumhara Naam', type: 'text', placeholder: 'Rahul Sharma' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'rahul@example.com' },
                { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Feature request / Bug / Sawaal' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: '600' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: '0.875rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: '600' }}>
                  Message
                </label>
                <textarea
                  placeholder="Apna message likhiye..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontSize: '0.875rem', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button type="submit" style={{
                padding: '13px', borderRadius: '12px', fontWeight: '700',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
              }}>
                📤 Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: '📧', title: 'Email', value: 'hello@tradelog.ai', sub: 'Business & support queries' },
            { icon: '🐦', title: 'Twitter / X', value: '@TradeLogAI', sub: 'Updates aur trading tips' },
            { icon: '💬', title: 'Discord', value: 'discord.gg/tradelog', sub: 'Community support' },
            { icon: '📍', title: 'Location', value: 'India 🇮🇳', sub: 'Proudly made for Indian traders' },
          ].map(item => (
            <div key={item.title} style={{
              padding: '20px 22px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', gap: '16px', alignItems: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: '700', color: 'white', fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '600' }}>{item.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '2px' }}>{item.sub}</div>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '8px', padding: '20px', borderRadius: '16px', textAlign: 'center',
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>⏰</div>
            <div style={{ fontWeight: '700', color: 'white', fontSize: '0.9rem', marginBottom: '4px' }}>
              Response Time
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
              Usually within 24 hours.<br />Priority support for Pro users.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
