import React, { useState, useEffect, useRef } from 'react'
import { Send, Image as ImageIcon, X, Mic, Square, Maximize, Minimize, Bot, Search, Brush, Download } from 'lucide-react'
import AIMentorPopup from '../components/AIMentorPopup'

export default function PracticeChart() {
  const container = useRef()
  const [symbolInput, setSymbolInput] = useState('')
  const [activeSymbol, setActiveSymbol] = useState('BINANCE:BTCUSDT')
  const [fullChart, setFullChart] = useState(false)
  const [showMentorPopup, setShowMentorPopup] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!symbolInput.trim()) return

    let clean = symbolInput.trim().toUpperCase()
    if (clean.includes(':')) {
      setActiveSymbol(clean)
    } else {
      if (clean === 'BTC' || clean === 'BTCUSD' || clean === 'BTC/USD') {
        setActiveSymbol('BINANCE:BTCUSDT')
      } else if (clean === 'ETH' || clean === 'ETHUSD' || clean === 'ETH/USD') {
        setActiveSymbol('BINANCE:ETHUSDT')
      } else if (['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META'].includes(clean)) {
        setActiveSymbol(`NASDAQ:${clean}`)
      } else if (clean.length === 6 && !clean.includes('/')) {
        setActiveSymbol(`FX:${clean}`)
      } else {
        setActiveSymbol(clean)
      }
    }
  }

  // -- Trading View Chart Injection --
  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ''
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": activeSymbol,
      "interval": "15",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    })
    
    container.current.appendChild(script)
  }, [activeSymbol])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Practice Chart
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Analyze charts and ask the AI Mentor for guidance.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2px 8px', alignItems: 'center' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              className="input-field" 
              placeholder="Symbol..." 
              value={symbolInput}
              onChange={e => setSymbolInput(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '120px', padding: '6px', boxShadow: 'none', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Load</button>
          </form>
          
          <button 
            className="btn outline"
            onClick={() => setFullChart(prev => !prev)}
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--border-color)' }}
          >
            {fullChart ? <Minimize size={16} /> : <Maximize size={16} />}
            {fullChart ? 'Exit Full Screen' : 'Full Screen'}
          </button>
          
          <button 
            className="btn"
            onClick={() => setShowMentorPopup(true)}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-color)', fontWeight: 'bold' }}
          >
            <Bot size={18} />
            AI Mentor
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ 
        flex: 1, 
        background: '#131722', 
        borderRadius: '16px', 
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        position: fullChart ? 'fixed' : 'relative',
        top: fullChart ? 0 : 'auto',
        left: fullChart ? 0 : 'auto',
        right: fullChart ? 0 : 'auto',
        bottom: fullChart ? 0 : 'auto',
        width: fullChart ? '100vw' : '100%',
        height: fullChart ? '100vh' : '100%',
        zIndex: fullChart ? 9999 : 1
      }}>
        <div ref={container} style={{ height: '100%', width: '100%' }} />
        
        {fullChart && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
            <button 
              className="btn"
              onClick={() => setShowMentorPopup(true)}
              style={{ padding: '10px 20px', background: 'var(--accent-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Bot size={18} /> AI Mentor
            </button>
            <button 
              className="btn outline"
              onClick={() => setFullChart(false)}
              style={{ padding: '10px', background: 'rgba(0,0,0,0.8)', borderColor: 'var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            >
              <Minimize size={18} />
            </button>
          </div>
        )}
      </div>

      {/* AI Mentor Pop-up Overlay */}
      {showMentorPopup && (
        <AIMentorPopup onClose={() => setShowMentorPopup(false)} />
      )}
    </div>
  )
}
