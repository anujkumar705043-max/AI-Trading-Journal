import React from 'react'

export default function DemoTrading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '24px' }}>Live Chart Demo Trading</h2>
        
        {/* Paper Trading Stats */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Balance:</span>
            <strong style={{ marginLeft: '8px', color: 'white' }}>$10,000.00</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Open P&L:</span>
            <strong style={{ marginLeft: '8px', color: 'var(--success)' }}>+$0.00</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* Chart Area */}
        <div style={{
          flex: 1,
          background: '#131722',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>Live Chart UI Placeholder (Trading View)</p>
        </div>

        {/* Order Entry Panel */}
        <div style={{
          width: '300px',
          background: 'rgba(17,21,29,0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Order Entry</h3>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ flex: 1, padding: '12px', background: 'rgba(52, 199, 149, 0.1)', color: 'var(--success)', border: '1px solid rgba(52, 199, 149, 0.3)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>BUY</button>
            <button style={{ flex: 1, padding: '12px', background: 'rgba(242, 85, 90, 0.1)', color: 'var(--danger)', border: '1px solid rgba(242, 85, 90, 0.3)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>SELL</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Quantity</label>
              <input type="number" defaultValue="1" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Stop Loss</label>
              <input type="number" placeholder="Price" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Take Profit</label>
              <input type="number" placeholder="Price" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px' }} />
            </div>
          </div>

          <button style={{
            marginTop: 'auto',
            padding: '14px',
            background: 'var(--text-primary)',
            color: 'var(--bg-dark)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Place Demo Order
          </button>
        </div>
      </div>
    </div>
  )
}
