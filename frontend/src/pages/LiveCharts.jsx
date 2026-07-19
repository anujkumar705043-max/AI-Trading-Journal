import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Search, Landmark, ArrowUpRight, ArrowDownRight, RefreshCw, CheckSquare, Shield, Play } from 'lucide-react'

export default function LiveCharts() {
  const container = useRef()
  const [symbolInput, setSymbolInput] = useState('')
  const [activeSymbol, setActiveSymbol] = useState('BINANCE:BTCUSDT')
  const [showIndicators, setShowIndicators] = useState(false)
  const [fullChart, setFullChart] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)

  // Calculators states
  const [riskInput, setRiskInput] = useState({ capital: '', risk_percent: '1' })
  const [riskResult, setRiskResult] = useState(null)

  const [pointInput, setPointInput] = useState({ capital: '', risk_percent: '1', stop_loss: '' })
  const [pointResult, setPointResult] = useState(null)

  const [posInput, setPosInput] = useState({ risk_amount: '', stop_loss: '' })
  const [posResult, setPosResult] = useState(null)

  const handleRiskCalculate = (e) => {
    e.preventDefault()
    const cap = Number(riskInput.capital) || balance
    const pct = Number(riskInput.risk_percent) || 0
    const amount = (cap * pct) / 100
    setRiskResult({ risk_amount: amount })
  }

  const handlePointCalculate = (e) => {
    e.preventDefault()
    const cap = Number(pointInput.capital) || balance
    const pct = Number(pointInput.risk_percent) || 0
    const sl = Number(pointInput.stop_loss) || 1
    const amount = (cap * pct) / 100
    const point = sl > 0 ? amount / sl : 0
    setPointResult({ risk_amount: amount, risk_per_point: point })
  }

  const handlePosCalculate = (e) => {
    e.preventDefault()
    const ra = Number(posInput.risk_amount) || 0
    const sl = Number(posInput.stop_loss) || 1
    const size = sl > 0 ? ra / sl : 0
    setPosResult({ position_size: size })
  }

  // Paper Trading State
  const [balance, setBalance] = useState(10000.00)
  const [positions, setPositions] = useState([])
  const [loadingAccount, setLoadingAccount] = useState(true)

  // Order configuration
  const [direction, setDirection] = useState('LONG')
  const [orderType, setOrderType] = useState('MARKET')
  const [limitPrice, setLimitPrice] = useState('')
  const [orderSize, setOrderSize] = useState('0.1')
  const [leverage, setLeverage] = useState(20)
  const [useTpSl, setUseTpSl] = useState(false)
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')

  // Price Feed & Orderbook State
  const [livePrice, setLivePrice] = useState(65000.00)
  const [priceHistory, setPriceHistory] = useState([])

  const quickSymbols = [
    { label: 'BTC/USD', value: 'BINANCE:BTCUSDT' },
    { label: 'ETH/USD', value: 'BINANCE:ETHUSDT' },
    { label: 'SOL/USD', value: 'BINANCE:SOLUSDT' },
    { label: 'AAPL', value: 'NASDAQ:AAPL' },
    { label: 'TSLA', value: 'NASDAQ:TSLA' },
    { label: 'EUR/USD', value: 'FX:EURUSD' }
  ]

  // Parse standard symbol from TV symbol (e.g. BINANCE:BTCUSDT -> BTCUSDT)
  const getCleanTicker = (tvSym) => {
    if (tvSym.includes(':')) {
      return tvSym.split(':')[1]
    }
    return tvSym
  }

  const cleanTicker = getCleanTicker(activeSymbol)

  // Fetch simulated wallet and active positions
  const fetchAccount = () => {
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/paper/account', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance)
        setPositions(data.positions)
        setLoadingAccount(false)
      })
      .catch(err => {
        console.error(err)
        setLoadingAccount(false)
      })
  }

  // Load TradingView Widget Script
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
      "studies": showIndicators ? [
        "STD;Average_True_Range",
        "STD;RSI",
        "STD;MACD"
      ] : [],
      "support_host": "https://www.tradingview.com"
    })
    
    container.current.appendChild(script)
  }, [activeSymbol, showIndicators])

  // Live Ticker pricing from Binance
  useEffect(() => {
    const symbol = cleanTicker.toUpperCase()
    
    // Fetch initial
    fetch(`https://api.binance.com/api/3/ticker/price?symbol=${symbol}`)
      .then(res => res.json())
      .then(data => {
        if (data.price) setLivePrice(Number(data.price))
      })
      .catch(() => {
        // Fallback for non-crypto symbols
        setLivePrice(cleanTicker.includes('EUR') ? 1.08 : cleanTicker.includes('AAPL') ? 180.50 : 250.00)
      })

    const interval = setInterval(() => {
      fetch(`https://api.binance.com/api/3/ticker/price?symbol=${symbol}`)
        .then(res => res.json())
        .then(data => {
          if (data.price) {
            const nextPrice = Number(data.price)
            setLivePrice(nextPrice)
            setPriceHistory(prev => {
              const hist = [...prev]
              if (hist.length > 10) hist.shift()
              hist.push({
                price: nextPrice + (Math.random() - 0.5) * 4,
                size: (Math.random() * 1.5).toFixed(3),
                side: Math.random() > 0.5 ? 'buy' : 'sell'
              })
              return hist
            })
          } else {
            throw new Error()
          }
        })
        .catch(() => {
          // Simulate price drift for stocks or offline
          setLivePrice(prev => {
            const nextPrice = prev + (Math.random() - 0.5) * (prev * 0.0005)
            setPriceHistory(p => {
              const hist = [...p]
              if (hist.length > 10) hist.shift()
              hist.push({
                price: nextPrice,
                size: (Math.random() * 1.5).toFixed(3),
                side: Math.random() > 0.5 ? 'buy' : 'sell'
              })
              return hist
            })
            return nextPrice
          })
        })
    }, 3000)

    return () => clearInterval(interval)
  }, [cleanTicker])

  useEffect(() => {
    fetchAccount()
  }, [])

  // Place simulated order
  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const entryPrice = orderType === 'MARKET' ? livePrice : Number(limitPrice)
    if (!entryPrice || entryPrice <= 0) {
      alert('Please enter a valid price.')
      return
    }

    const payload = {
      symbol: cleanTicker,
      direction: direction,
      size: Number(orderSize),
      entry_price: entryPrice,
      leverage: Number(leverage),
      stop_loss: useTpSl && stopLoss ? Number(stopLoss) : null,
      take_profit: useTpSl && takeProfit ? Number(takeProfit) : null
    }

    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/paper/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.detail || 'Order failed') })
        return res.json()
      })
      .then(() => {
        fetchAccount()
        alert('Futures order executed successfully! Position opened.')
      })
      .catch(err => {
        alert(err.message)
      })
  }

  // Close position
  const handleClosePosition = (id) => {
    const token = localStorage.getItem('token')
    fetch(`https://ai-trading-journal-m373.onrender.com/paper/close/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ exit_price: livePrice })
    })
      .then(res => res.json())
      .then(data => {
        fetchAccount()
        alert(`Position closed successfully! Realized PNL: $${data.pnl.toFixed(2)} USDT. Automatically logged to journal.`)
      })
      .catch(err => console.error(err))
  }

  const handleResetWallet = () => {
    if (confirm('Reset your simulated balance back to $10,000.00 and close all open positions?')) {
      const token = localStorage.getItem('token')
      fetch('https://ai-trading-journal-m373.onrender.com/paper/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(() => {
          fetchAccount()
        })
        .catch(err => console.error(err))
    }
  }

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

  // Live order calculations
  const parsedSize = Number(orderSize) || 0
  const previewPrice = orderType === 'MARKET' ? livePrice : (Number(limitPrice) || livePrice)
  const orderValue = parsedSize * previewPrice
  const requiredMargin = orderValue / leverage

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', margin: 0 }}>
            <TrendingUp size={30} style={{ color: 'var(--success)' }} />
            Live Trading Terminal
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Leveraged futures execution environment connected directly to your trading journal.
          </p>
        </div>

        {/* Demo Wallet Card */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', minWidth: '160px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Demo wallet Balance</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--success)' }}>
              ${balance.toFixed(2)} USDT
            </span>
          </div>
          <button className="btn outline danger" onClick={handleResetWallet} style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
            Reset Wallet
          </button>
        </div>
      </div>

      {/* Quick Select & Search Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        
        {/* Quick select buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {quickSymbols.map(qs => (
            <button 
              key={qs.value} 
              className="btn outline" 
              onClick={() => {
                setActiveSymbol(qs.value)
                setSymbolInput('')
              }}
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.8rem',
                background: activeSymbol === qs.value ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: activeSymbol === qs.value ? 'var(--accent-color)' : 'var(--border-color)',
                color: activeSymbol === qs.value ? 'white' : 'var(--text-secondary)'
              }}
            >
              {qs.label}
            </button>
          ))}
        </div>

        {/* Indicator toggle */}
        <button 
          className="btn outline"
          onClick={() => setShowIndicators(prev => !prev)}
          style={{ 
            padding: '6px 12px', 
            fontSize: '0.8rem',
            borderColor: showIndicators ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
            color: showIndicators ? 'var(--danger)' : 'var(--success)'
          }}
        >
          {showIndicators ? '🚫 Clear Indicators' : '📊 Add Indicators'}
        </button>

        <button 
          className="btn outline"
          onClick={() => setFullChart(prev => !prev)}
          style={{ 
            padding: '6px 12px', 
            fontSize: '0.8rem',
            borderColor: 'var(--accent-color)',
            color: 'white'
          }}
        >
          {fullChart ? '📱 Show Trade Panel' : '🖥️ Full Chart'}
        </button>

        <button 
          className="btn outline"
          onClick={() => setShowCalculator(true)}
          style={{ 
            padding: '6px 12px', 
            fontSize: '0.8rem',
            borderColor: 'rgba(139, 92, 246, 0.4)',
            color: '#a78bfa',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🧮 Calculator
        </button>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2px 8px', marginLeft: 'auto', alignItems: 'center' }}>
          <Search size={16} style={{ color: 'var(--text-secondary)' }} />
          <input 
            className="input-field" 
            placeholder="Search e.g. BTCUSD, NASDAQ:AAPL..." 
            value={symbolInput}
            onChange={e => setSymbolInput(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '200px', padding: '6px', boxShadow: 'none', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Load
          </button>
        </form>
      </div>

      {/* Main Trading Area Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: fullChart ? '1fr' : '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Side: Advanced Chart Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ height: fullChart ? '620px' : '480px', padding: '10px', borderRadius: '16px', overflow: 'hidden' }}>
            <div ref={container} style={{ height: '100%', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                Loading TradingView Chart Widget...
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Leverage Order Placement Box */}
        {!fullChart && (
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* BUY/SELL Toggle Header */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: '8px' }}>
              <button 
                type="button" 
                onClick={() => setDirection('LONG')}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '6px',
                  background: direction === 'LONG' ? 'var(--success)' : 'transparent',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                LONG (Buy)
              </button>
              <button 
                type="button" 
                onClick={() => setDirection('SHORT')}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '6px',
                  background: direction === 'SHORT' ? 'var(--danger)' : 'transparent',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                SHORT (Sell)
              </button>
            </div>

            {/* Form details */}
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="input-group">
                <label>Asset Symbol</label>
                <div style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                  {cleanTicker}
                </div>
              </div>

              <div className="input-group">
                <label>Order Type</label>
                <select className="input-field" value={orderType} onChange={e => setOrderType(e.target.value)}>
                  <option value="MARKET">Market Price (${livePrice.toFixed(2)})</option>
                  <option value="LIMIT">Limit Price</option>
                </select>
              </div>

              {orderType === 'LIMIT' && (
                <div className="input-group">
                  <label>Limit Execution Price (USDT)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="input-field" 
                    placeholder={livePrice.toFixed(2)}
                    value={limitPrice}
                    onChange={e => setLimitPrice(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label>Order Quantity (contracts)</label>
                <input 
                  type="number" 
                  step="any" 
                  className="input-field"
                  value={orderSize}
                  onChange={e => setOrderSize(e.target.value)}
                  required
                />
              </div>

              {/* Leverage Slider */}
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Leverage Multiplier</span>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{leverage}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  className="input-field" 
                  style={{ height: '8px', cursor: 'pointer', padding: 0 }}
                  value={leverage}
                  onChange={e => setLeverage(Number(e.target.value))}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '6px' }}>
                  {[5, 10, 25, 50, 100].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      onClick={() => setLeverage(val)}
                      style={{
                        background: leverage === val ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.01)',
                        border: leverage === val ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                        color: leverage === val ? 'white' : 'var(--text-secondary)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        padding: '4px 0',
                        cursor: 'pointer'
                      }}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Stop Loss / Take profit checklists */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '8px' }}>
                  <input type="checkbox" checked={useTpSl} onChange={e => setUseTpSl(e.target.checked)} />
                  <span>TP/SL Trigger Parameters</span>
                </label>

                {useTpSl && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="input-group">
                      <label style={{ fontSize: '0.7rem' }}>Take Profit (USDT)</label>
                      <input type="number" step="any" className="input-field" placeholder="0.00" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label style={{ fontSize: '0.7rem' }}>Stop Loss (USDT)</label>
                      <input type="number" step="any" className="input-field" placeholder="0.00" value={stopLoss} onChange={e => setStopLoss(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Calculations summaries */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Contract Value:</span>
                  <span style={{ color: 'white' }}>${orderValue.toFixed(2)} USDT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Required Margin:</span>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>${requiredMargin.toFixed(2)} USDT</span>
                </div>
              </div>

              {/* Place trade button */}
              <button 
                type="submit" 
                className="btn" 
                style={{ 
                  background: direction === 'LONG' ? 'var(--success)' : 'var(--danger)',
                  padding: '10px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                EXECUTE {direction === 'LONG' ? 'BUY LONG' : 'SELL SHORT'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Grid bottom row: Positions Table & Simulated Order Book */}
      <div style={{ display: 'grid', gridTemplateColumns: fullChart ? '1fr' : '1fr 340px', gap: '20px', marginTop: '10px' }}>
        
        {/* Open positions list */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'white', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '1.1rem' }}>
            <Shield size={20} style={{ color: 'var(--accent-color)' }} />
            Active Leveraged Positions
          </h3>

          {positions.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '30px' }}>
              No active leverage positions open on {cleanTicker}.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 6px' }}>Symbol</th>
                    <th style={{ padding: '10px 6px' }}>Leverage</th>
                    <th style={{ padding: '10px 6px' }}>Size</th>
                    <th style={{ padding: '10px 6px' }}>Entry Price</th>
                    <th style={{ padding: '10px 6px' }}>Mark Price</th>
                    <th style={{ padding: '10px 6px' }}>Liquidation</th>
                    <th style={{ padding: '10px 6px' }}>Margin</th>
                    <th style={{ padding: '10px 6px' }}>Unrealized PNL (ROE%)</th>
                    <th style={{ padding: '10px 6px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(pos => {
                    const isLong = pos.direction === 'LONG'
                    const sizeVal = pos.size
                    const pnl = isLong 
                      ? (livePrice - pos.entry_price) * sizeVal 
                      : (pos.entry_price - livePrice) * sizeVal
                    
                    const roe = (pnl / pos.margin) * 100
                    const pnlColor = pnl >= 0 ? 'var(--success)' : 'var(--danger)'
                    const liqPrice = isLong 
                      ? pos.entry_price * (1 - (1 / pos.leverage))
                      : pos.entry_price * (1 + (1 / pos.leverage))

                    return (
                      <tr key={pos.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '12px 6px', fontWeight: 'bold' }}>
                          <span style={{ 
                            color: isLong ? 'var(--success)' : 'var(--danger)', 
                            marginRight: '6px',
                            fontSize: '0.65rem',
                            border: `1px solid ${isLong ? 'var(--success)' : 'var(--danger)'}`,
                            padding: '1px 3px',
                            borderRadius: '3px'
                          }}>
                            {pos.direction}
                          </span>
                          {pos.symbol}
                        </td>
                        <td style={{ padding: '12px 6px', color: 'white' }}>{pos.leverage}x</td>
                        <td style={{ padding: '12px 6px', color: 'white' }}>{sizeVal}</td>
                        <td style={{ padding: '12px 6px', color: 'var(--text-secondary)' }}>${pos.entry_price.toFixed(2)}</td>
                        <td style={{ padding: '12px 6px', color: 'var(--accent-color)' }}>${livePrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 6px', color: 'var(--danger)' }}>${liqPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 6px', color: 'var(--text-secondary)' }}>${pos.margin.toFixed(2)}</td>
                        <td style={{ padding: '12px 6px', color: pnlColor, fontWeight: 'bold' }}>
                          ${pnl.toFixed(2)} ({roe.toFixed(1)}%)
                        </td>
                        <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleClosePosition(pos.id)} 
                            style={{ 
                              padding: '5px 10px', 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              border: '1px solid var(--danger)',
                              color: 'var(--danger)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}
                          >
                            Market Close
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real-time Order book display */}
        {!fullChart && (
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ margin: 0, color: 'white', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.95rem' }}>
              <Play size={14} className="spin" style={{ color: 'var(--accent-color)', animation: 'spin 4s linear infinite' }} />
              Live Order Book
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {/* Sell Orders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', opacity: 0.8 }}>
                {priceHistory.filter(o => o.side === 'sell').slice(-3).reverse().map((o, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>{o.price.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{o.size}</span>
                  </div>
                ))}
              </div>

              {/* Spread */}
              <div style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', margin: '4px 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {livePrice.toFixed(2)}
                  {Math.random() > 0.5 ? (
                    <ArrowUpRight size={14} style={{ color: 'var(--success)' }} />
                  ) : (
                    <ArrowDownRight size={14} style={{ color: 'var(--danger)' }} />
                  )}
                </span>
              </div>

              {/* Buy Orders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', opacity: 0.8 }}>
                {priceHistory.filter(o => o.side === 'buy').slice(-3).map((o, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>{o.price.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{o.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    {/* Sliding Calculator Sidebar Overlay */}
    {showCalculator && (
      <>
        {/* Backdrop */}
        <div 
          onClick={() => setShowCalculator(false)}
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
        
        {/* Sidebar Drawer */}
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '380px',
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.95)',
            borderLeft: '1px solid var(--border-color)',
            padding: '30px',
            overflowY: 'auto',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🧮</span>
              <h3 style={{ color: 'white', margin: 0 }}>Position Calculator</h3>
            </div>
            <button 
              onClick={() => setShowCalculator(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {/* Risk Calculator Card */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-color)' }}>Risk Sizer</h4>
            <form onSubmit={handleRiskCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Account Capital ($)</label>
                <input type="number" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={riskInput.capital} placeholder={balance.toFixed(2)} onChange={e => setRiskInput({...riskInput, capital: e.target.value})} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Risk %</label>
                <input type="number" step="any" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={riskInput.risk_percent} onChange={e => setRiskInput({...riskInput, risk_percent: e.target.value})} />
              </div>
              <button type="submit" className="btn outline" style={{ padding: '6px', fontSize: '0.75rem' }}>Calculate Risk</button>
            </form>
            {riskResult && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.8rem' }}>
                Max Risk: <strong style={{ color: 'var(--danger)' }}>${riskResult.risk_amount.toFixed(2)}</strong>
              </div>
            )}
          </div>

          {/* Risk Per Point Card */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--success)' }}>Risk Per Point</h4>
            <form onSubmit={handlePointCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Account Capital ($)</label>
                <input type="number" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={pointInput.capital} placeholder={balance.toFixed(2)} onChange={e => setPointInput({...pointInput, capital: e.target.value})} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Risk %</label>
                <input type="number" step="any" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={pointInput.risk_percent} onChange={e => setPointInput({...pointInput, risk_percent: e.target.value})} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Stop Loss (Points)</label>
                <input type="number" step="any" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={pointInput.stop_loss} placeholder="e.g. 100" onChange={e => setPointInput({...pointInput, stop_loss: e.target.value})} />
              </div>
              <button type="submit" className="btn outline" style={{ padding: '6px', fontSize: '0.75rem' }}>Calculate Point Risk</button>
            </form>
            {pointResult && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total: <strong>${pointResult.risk_amount.toFixed(2)}</strong></span>
                <span>Per Point: <strong style={{ color: 'var(--accent-color)' }}>${pointResult.risk_per_point.toFixed(4)}</strong></span>
              </div>
            )}
          </div>

          {/* Position Size Card */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', textTransform: 'uppercase', color: '#8b5cf6' }}>Position Sizer</h4>
            <form onSubmit={handlePosCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Risk Amount ($)</label>
                <input type="number" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={posInput.risk_amount} placeholder="e.g. 100" onChange={e => setPosInput({...posInput, risk_amount: e.target.value})} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem' }}>Stop Loss Distance (Points)</label>
                <input type="number" step="any" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={posInput.stop_loss} placeholder="e.g. 50" onChange={e => setPosInput({...posInput, stop_loss: e.target.value})} />
              </div>
              <button type="submit" className="btn outline" style={{ padding: '6px', fontSize: '0.75rem' }}>Calculate Quantity</button>
            </form>
            {posResult && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.8rem' }}>
                Recommended Qty: <strong style={{ color: 'var(--success)' }}>{posResult.position_size.toFixed(4)} Units</strong>
              </div>
            )}
          </div>

        </div>
      </>
    )}
    </div>
  )
}
