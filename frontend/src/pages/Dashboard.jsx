import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/statistics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ 
        width: '50px', height: '50px', 
        border: '4px solid rgba(255,255,255,0.1)', 
        borderTopColor: 'var(--accent-color)', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const formatValue = (key, value) => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')) {
        return `${value.toFixed(2)}%`;
      }
      if (key.toLowerCase().includes('profit') || key.toLowerCase().includes('capital') || key.toLowerCase().includes('loss')) {
        return `$${value.toFixed(2)}`;
      }
      if (Number.isInteger(value)) return value;
      return value.toFixed(2);
    }
    return value;
  }

  // Icons mapping based on typical stats keys
  const getIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes('profit')) return '💰';
    if (k.includes('loss')) return '📉';
    if (k.includes('rate') || k.includes('win')) return '🏆';
    if (k.includes('trade')) return '📊';
    return '⚡';
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Performance Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your AI trading metrics in real-time.</p>
        </div>
        <button className="btn outline" onClick={() => window.location.reload()}>
          🔄 Refresh
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px' 
      }}>
        {stats && Object.entries(stats).map(([key, value], index) => {
          const isPositive = typeof value === 'number' && value > 0;
          const isNegative = typeof value === 'number' && value < 0;
          
          let valueColor = 'white';
          if (isPositive && !key.toLowerCase().includes('loss')) valueColor = 'var(--success)';
          if (isNegative || key.toLowerCase().includes('loss') && value > 0) valueColor = 'var(--danger)';

          return (
            <div key={key} className="glass-panel" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              animation: `fadeIn 0.5s ease forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Glow */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: valueColor === 'var(--success)' ? 'var(--success-glow)' : valueColor === 'var(--danger)' ? 'var(--danger-glow)' : 'var(--accent-glow)',
                filter: 'blur(40px)',
                borderRadius: '50%',
                opacity: 0.5,
                zIndex: 0
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '8px', 
                  borderRadius: '10px',
                  fontSize: '1.2rem' 
                }}>
                  {getIcon(key)}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500', textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </span>
              </div>

              <div style={{ zIndex: 1, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: valueColor,
                  letterSpacing: '-0.02em'
                }}>
                  {formatValue(key, value)}
                </span>
                
                {(isPositive || isNegative) && (
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: isPositive ? 'var(--success)' : 'var(--danger)',
                    background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    {isPositive ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
