import React, { useState } from 'react'

export default function PracticeChart() {
  const [aiDrawing, setAiDrawing] = useState(false)
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '24px' }}>Practice Chart</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            padding: '8px 16px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white'
          }}>
            Draw Trendline
          </button>
          <button style={{
            padding: '8px 16px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white'
          }}>
            Draw S/R Level
          </button>
          <button 
            onClick={() => setAiDrawing(!aiDrawing)}
            style={{
              padding: '8px 16px', 
              background: aiDrawing ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
              border: '1px solid #6366f1', borderRadius: '8px', 
              color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span>✨</span>
            {aiDrawing ? 'AI is Drawing...' : 'Ask AI to Draw'}
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{
        flex: 1,
        background: '#131722',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Placeholder for TradingView or lightweight-charts */}
        <p style={{ color: 'var(--text-secondary)' }}>Live Chart UI Placeholder (Practice Mode)</p>
        
        {aiDrawing && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(99,102,241,0.05)', pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             <div style={{
               border: '2px dashed #8b5cf6', width: '60%', height: '40%',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: '#8b5cf6', fontSize: '1.2rem', background: 'rgba(139,92,246,0.1)'
             }}>
               [AI is rendering structural drawings...]
             </div>
          </div>
        )}
      </div>

      {/* AI Doubt Resolution Panel */}
      <div style={{
        background: 'rgba(17,21,29,0.8)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        <h3 style={{ margin: 0, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
          <span>🎙️</span> AI Doubt Resolution
        </h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Having trouble understanding a pattern? Ask the AI via text or audio.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            placeholder="Type your doubt here..."
            style={{
              flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', padding: '10px 16px', borderRadius: '8px'
            }}
          />
          <button style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'white'
          }}>
            🎤
          </button>
          <button style={{
            background: '#8b5cf6', color: 'white', 
            border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
          }}>
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
