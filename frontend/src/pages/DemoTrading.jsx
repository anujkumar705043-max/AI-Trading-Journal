import { useState, useEffect } from 'react'
import { Landmark, ArrowUpRight, ArrowDownRight, RefreshCw, X, Play, Shield } from 'lucide-react'

export default function DemoTrading() {
  const [balance, setBalance] = useState(10000.00)
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)

  // Order state
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT')
  const [direction, setDirection] = useState('LONG') // LONG or SHORT
  const [orderType, setOrderType] = useState('MARKET') // MARKET or LIMIT
  const [limitPrice, setLimitPrice] = useState('')
  const [orderSize, setOrderSize] = useState('0.1')
  const [leverage, setLeverage] = useState(20)
  const [useTpSl, setUseTpSl] = useState(false)
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')

  // Live Price State
  const [livePrice, setLivePrice] = useState(65000.00)
  const [priceHistory, setPriceHistory] = useState([])

  // Load account
  const fetchAccount = () => {
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/paper/account', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance)
        setPositions(data.positions)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  // Poll live price from Binance API
  useEffect(() => {
    const symbol = activeSymbol.toUpperCase()
    // Fetch initial
    fetch(`https://api.binance.com/api/3/ticker/price?symbol=${symbol}`)
      .then(res => res.json())
      .then(data => {
        if (data.price) setLivePrice(Number(data.price))
      })
      .catch(() => {})

    const interval = setInterval(() => {
      fetch(`https://api.binance.com/api/3/ticker/price?symbol=${symbol}`)
        .then(res => res.json())
        .then(data => {
          if (data.price) {
            const newPrice = Number(data.price)
            setLivePrice(newPrice)
            
            // Build pseudo orderbook history
            setPriceHistory(prev => {
              const hist = [...prev]
              if (hist.length > 10) hist.shift()
              hist.push({
                price: newPrice + (Math.random() - 0.5) * 4,
                size: (Math.random() * 2).toFixed(3),
                side: Math.random() > 0.5 ? 'buy' : 'sell'
              })
              return hist
            })
          }
        })
        .catch(() => {
          // Fallback simulation if offline/blocked
          setLivePrice(prev => {
            const nextPrice = prev + (Math.random() - 0.5) * 8
            setPriceHistory(p => {
              const hist = [...p]
              if (hist.length > 10) hist.shift()
              hist.push({
                price: nextPrice,
                size: (Math.random() * 2).toFixed(3),
                side: Math.random() > 0.5 ? 'buy' : 'sell'
              })
              return hist
            })
            return nextPrice
          })
        })
    }, 3000)

    return () => clearInterval(interval)
  }, [activeSymbol])

  useEffect(() => {
    fetchAccount()
  }, [])

  // Place order
  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const entryPrice = orderType === 'MARKET' ? livePrice : Number(limitPrice)
    if (!entryPrice || entryPrice <= 0) {
      alert('Please enter a valid price.')
      return
    }

    const payload = {
      symbol: activeSymbol,
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
        alert('Futures order successfully placed!')
      })
      .catch(err => {
        alert(err.message)
      })
  }

  // Close open position
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
        alert(`Position closed successfully! Realized PNL: $${data.pnl.toFixed(2)} USDT. Logged to trade journal.`)
      })
      .catch(err => console.error(err))
  }

  // Reset Wallet
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

  // Math Calculations for live preview
  const parsedSize = Number(orderSize) || 0
  const previewPrice = orderType === 'MARKET' ? livePrice : (Number(limitPrice) || livePrice)
  const orderValue = parsedSize * previewPrice
  const requiredMargin = orderValue / leverage

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  )

  return (
    <div>
      {/* Upper header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', margin: 0 }}>
            <Landmark size={28} style={{ color: 'var(--accent-color)' }} />
            Delta Futures Demo Platform
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Real-time leveraged paper trading. Trade with standard mock assets.</p>
        </div>

        {/* Balance Status card */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Demo wallet Balance</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>
              ${balance.toFixed(2)} USDT
            </span>
          </div>
          <button className="btn outline danger" onClick={handleResetWallet} style={{ padding: '12px' }}>
            Reset Wallet
          </button>
        </div>
      </div>

      {/* Delta Exchange Style Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 280px', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Side: Order Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Buy Long / Sell Short Tab toggler */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
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
              BUY / LONG
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
              SELL / SHORT
            </button>
          </div>

          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Symbol Ticker Selector */}
            <div className="input-group">
              <label>Select Contract</label>
              <select className="input-field" value={activeSymbol} onChange={e => setActiveSymbol(e.target.value)}>
                <option value="BTCUSDT">BTCUSDT (Bitcoin Futures)</option>
                <option value="ETHUSDT">ETHUSDT (Ethereum Futures)</option>
                <option value="SOLUSDT">SOLUSDT (Solana Futures)</option>
                <option value="BNBUSDT">BNBUSDT (Binance Coin Futures)</option>
              </select>
            </div>

            {/* Limit / Market Selector */}
            <div className="input-group">
              <label>Order Type</label>
              <select className="input-field" value={orderType} onChange={e => setOrderType(e.target.value)}>
                <option value="MARKET">Market Execution</option>
                <option value="LIMIT">Limit Price</option>
              </select>
            </div>

            {/* Limit Price Input if selected */}
            {orderType === 'LIMIT' && (
              <div className="input-group">
                <label>Limit Price (USDT)</label>
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

            {/* Order Size */}
            <div className="input-group">
              <label>Quantity ({activeSymbol.replace('USDT', '')})</label>
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
                <span>Leverage</span>
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
              {/* Quick Select leverage */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '6px' }}>
                {[5, 10, 25, 50, 100].map(val => (
                  <button 
                    key={val} 
                    type="button" 
                    onClick={() => setLeverage(val)}
                    style={{
                      background: leverage === val ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.02)',
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

            {/* Advanced: Stop Loss / Take Profit */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '8px' }}>
                <input type="checkbox" checked={useTpSl} onChange={e => setUseTpSl(e.target.checked)} />
                <span>Trigger Orders (TP/SL)</span>
              </label>

              {useTpSl && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.75rem' }}>Take Profit Trigger Price</label>
                    <input type="number" step="any" className="input-field" placeholder="0.00" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '0.75rem' }}>Stop Loss Trigger Price</label>
                    <input type="number" step="any" className="input-field" placeholder="0.00" value={stopLoss} onChange={e => setStopLoss(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Margin and cost specs */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Order Value:</span>
                <span style={{ color: 'white' }}>${orderValue.toFixed(2)} USDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Required Margin:</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>${requiredMargin.toFixed(2)} USDT</span>
              </div>
            </div>

            {/* Execution Button */}
            <button 
              type="submit" 
              className="btn" 
              style={{ 
                background: direction === 'LONG' ? 'var(--success)' : 'var(--danger)',
                padding: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                marginTop: '10px'
              }}
            >
              PLACE {direction === 'LONG' ? 'BUY LONG' : 'SELL SHORT'} ORDER
            </button>

          </form>
        </div>

        {/* Center Panel: Chart & Positions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Chart View */}
          <div className="glass-panel" style={{ height: '420px', padding: '10px', overflow: 'hidden' }}>
            <iframe
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BINANCE%3A${activeSymbol}&interval=15&hidesidetoolbar=1&symboledit=0&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=exchange`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Demo TV Chart"
            />
          </div>

          {/* Positions View */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'white', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Shield size={20} style={{ color: 'var(--accent-color)' }} />
              Active Futures Positions
            </h3>
            
            {positions.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '30px' }}>
                No active positions. Configure the panel on the left to enter a simulated leverage position!
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 8px' }}>Symbol</th>
                      <th style={{ padding: '12px 8px' }}>Leverage</th>
                      <th style={{ padding: '12px 8px' }}>Size</th>
                      <th style={{ padding: '12px 8px' }}>Entry Price</th>
                      <th style={{ padding: '12px 8px' }}>Mark Price</th>
                      <th style={{ padding: '12px 8px' }}>Liquidation</th>
                      <th style={{ padding: '12px 8px' }}>Margin</th>
                      <th style={{ padding: '12px 8px' }}>Unrealized PNL (ROE%)</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map(pos => {
                      const isLong = pos.direction === 'LONG'
                      const sizeVal = pos.size
                      
                      // Live PNL calculation based on Binance Ticker
                      const pnl = isLong 
                        ? (livePrice - pos.entry_price) * sizeVal 
                        : (pos.entry_price - livePrice) * sizeVal
                      
                      const roe = (pnl / pos.margin) * 100
                      const pnlColor = pnl >= 0 ? 'var(--success)' : 'var(--danger)'

                      // Liquidation price calculation
                      const liqPrice = isLong 
                        ? pos.entry_price * (1 - (1 / pos.leverage))
                        : pos.entry_price * (1 + (1 / pos.leverage))

                      return (
                        <tr key={pos.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '14px 8px', fontWeight: 'bold' }}>
                            <span style={{ 
                              color: isLong ? 'var(--success)' : 'var(--danger)', 
                              marginRight: '6px',
                              fontSize: '0.7rem',
                              border: `1px solid ${isLong ? 'var(--success)' : 'var(--danger)'}`,
                              padding: '2px 4px',
                              borderRadius: '4px'
                            }}>
                              {pos.direction}
                            </span>
                            {pos.symbol}
                          </td>
                          <td style={{ padding: '14px 8px', color: 'white' }}>{pos.leverage}x</td>
                          <td style={{ padding: '14px 8px', color: 'white' }}>{sizeVal}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--text-secondary)' }}>${pos.entry_price.toFixed(2)}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--accent-color)' }}>${livePrice.toFixed(2)}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--danger)' }}>${liqPrice.toFixed(2)}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--text-secondary)' }}>${pos.margin.toFixed(2)}</td>
                          <td style={{ padding: '14px 8px', color: pnlColor, fontWeight: 'bold' }}>
                            ${pnl.toFixed(2)} ({roe.toFixed(1)}%)
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleClosePosition(pos.id)} 
                              style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                border: '1px solid var(--danger)',
                                color: 'var(--danger)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
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

        </div>

        {/* Right Side: Live Order Book Simulator */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, color: 'white', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '1.05rem' }}>
            <Play size={16} className="spin" style={{ color: 'var(--accent-color)', animation: 'spin 4s linear infinite' }} />
            Order Book
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFormat: 'monospace', fontSize: '0.8rem' }}>
            {/* Sell Orders (Asks) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.8 }}>
              {priceHistory.filter(o => o.side === 'sell').slice(-4).reverse().map((o, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                  <span>{o.price.toFixed(2)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{o.size}</span>
                </div>
              ))}
            </div>

            {/* Spread / Mid Market Price */}
            <div style={{ padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', margin: '6px 0' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {livePrice.toFixed(2)} 
                {Math.random() > 0.5 ? (
                  <ArrowUpRight size={18} style={{ color: 'var(--success)' }} />
                ) : (
                  <ArrowDownRight size={18} style={{ color: 'var(--danger)' }} />
                )}
              </span>
            </div>

            {/* Buy Orders (Bids) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.8 }}>
              {priceHistory.filter(o => o.side === 'buy').slice(-4).map((o, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>{o.price.toFixed(2)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{o.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
