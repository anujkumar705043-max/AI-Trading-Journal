import React from 'react'

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
    </div>
  )
}
