import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PublicNavbar />

      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '100px',
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
          fontSize: '0.8rem', fontWeight: '600', color: '#a5b4fc', marginBottom: '24px'
        }}>
          👋 Our Story
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900', margin: '0 0 24px',
          background: 'linear-gradient(to right, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Ek trader ki problem se ek product bana
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
          Mujhe trading mein loss hoti thi — lekin main samajh nahi pata tha kyun. Excel spreadsheets, random screenshots,
          aur notes — kuch bhi properly organized nahi tha. Tab maine socha: <strong style={{ color: 'white' }}>agar AI meri help karey to?</strong>
        </p>
      </section>

      {/* Story Sections */}
      <section style={{ padding: '40px 24px 80px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Mission */}
        <div style={{
          padding: '36px', borderRadius: '20px',
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🎯</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', margin: '0 0 12px' }}>Hamara Mission</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.75, margin: 0 }}>
            Retail traders ko whi tools dena jo institutional traders use karte hain — lekin simple, affordable,
            aur AI-powered. Har trader apni mistakes se seekhe, apna system develop kare, aur consistently profitable bane.
          </p>
        </div>

        {/* Values */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px', marginBottom: '40px',
        }}>
          {[
            { icon: '🔍', title: 'Transparency', desc: 'Koi hidden fees, koi data selling. Sirf pure value.' },
            { icon: '🤖', title: 'AI First', desc: 'Har feature mein intelligence build-in hai.' },
            { icon: '🇮🇳', title: 'Made for India', desc: 'Hinglish UI, INR pricing, Indian exchanges.' },
            { icon: '📈', title: 'Growth Focused', desc: 'Tumhara win rate improve karna hamari success hai.' },
          ].map(v => (
            <div key={v.title} style={{
              padding: '24px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{v.icon}</div>
              <div style={{ fontWeight: '700', color: 'white', marginBottom: '6px', fontSize: '0.95rem' }}>{v.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.825rem', lineHeight: 1.6 }}>{v.desc}</div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div style={{
          padding: '32px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '40px',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', margin: '0 0 16px' }}>🛠️ Tech Stack</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['React 18', 'FastAPI (Python)', 'SQLite / PostgreSQL', 'GPT-4 API', 'Vite', 'Render.com'].map(tech => (
              <span key={tech} style={{
                padding: '5px 14px', borderRadius: '100px',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                fontSize: '0.8rem', color: '#a5b4fc', fontWeight: '600',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/register" style={{
            textDecoration: 'none', padding: '14px 36px', borderRadius: '14px',
            fontWeight: '700', fontSize: '1rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', boxShadow: '0 8px 25px rgba(99,102,241,0.3)',
          }}>
            Join the Journey →
          </Link>
        </div>
      </section>
    </div>
  )
}
