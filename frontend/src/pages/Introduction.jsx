import React, { useState } from 'react'

const TEXT = '#EDEFF2'
const GOLD = '#E8B24D'
const DIM = '#5B6472'
const diag = { background: 'rgba(23,27,37,0.8)', border: '1px solid rgba(237,239,242,0.09)', borderRadius: '14px', padding: '20px', backdropFilter: 'blur(8px)' }

function HeroChart() {
  const images = [
    "/BTCUSD_2026-07-19_10-39-11.png",
    "/BTCUSD_2026-07-19_11-07-22.png",
    "/Screenshot 2026-07-19 112108.png"
  ]
  const [curr, setCurr] = useState(0)

  const prev = () => setCurr(c => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurr(c => (c + 1) % images.length)

  const arrowBtn = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(10,13,18,0.6)', color: TEXT, border: '1px solid rgba(237,239,242,0.16)',
    borderRadius: '50%', width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10, transition: 'all 0.2s',
    fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px'
  }

  return (
    <div style={{ ...diag, marginTop: '44px', position: 'relative' }}>
      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', color: '#E8B24D', margin: '0 0 16px 0', textAlign: 'center' }}>Examples of trades</h3>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
        <button onClick={prev} style={{ ...arrowBtn, left: '12px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,13,18,0.9)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,13,18,0.6)'}>&lt;</button>
        <button onClick={next} style={{ ...arrowBtn, right: '12px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,13,18,0.9)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,13,18,0.6)'}>&gt;</button>
        <div style={{ display: 'flex', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${curr * 100}%)` }}>
          {images.map((src, i) => (
            <img 
              key={src}
              src={src} 
              alt={`Trade Example ${i + 1}`} 
              style={{ width: '100%', flexShrink: 0 }} 
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        {images.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurr(i)}
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              border: 'none',
              background: curr === i ? GOLD : DIM,
              cursor: 'pointer',
              transition: 'background 0.3s'
            }} 
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}


export default function Introduction() {
  return (
    <div className="card animate-fade-in" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '20px',
        background: 'linear-gradient(to right, #6366f1, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Welcome to Trading Setup
      </h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Our Aim</h2>
        <ul style={{ 
          listStyleType: 'disc', 
          paddingLeft: '20px', 
          color: 'var(--text-secondary)',
          lineHeight: '1.8',
          fontSize: '1.1rem'
        }}>
          <li>Teach trading to people.</li>
          <li>Teach the complete trading setup.</li>
          <li>First, help you understand the working of my specific trading setup.</li>
        </ul>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Introduction Video</h2>
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'rgba(255,255,255,0.05)',
          border: '2px dashed rgba(255,255,255,0.1)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🎥</span>
          <p>Video placeholder (To be uploaded later when everything is ready)</p>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <HeroChart />
      </div>
    </div>
  )
}
