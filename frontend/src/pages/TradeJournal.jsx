import { useState, useEffect } from 'react'
import { Search, Trash2, CheckSquare, X, Download } from 'lucide-react'

export default function TradeJournal() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Close Trade Modal state
  const [editingTrade, setEditingTrade] = useState(null)
  const [exitPrice, setExitPrice] = useState('')
  const [updateNotes, setUpdateNotes] = useState('')
  
  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState(null)

  // Syncing state
  const [syncing, setSyncing] = useState(false)

  const handleSyncExchanges = () => {
    setSyncing(true)
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/exchanges/sync', { 
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Exchanges synced successfully!')
        setSyncing(false)
        fetchTrades()
      })
      .catch(err => {
        console.error(err)
        alert('Exchange synchronization failed. Check your API configurations in Settings.')
        setSyncing(false)
      })
  }

  const fetchTrades = () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/trades', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTrades(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      fetchTrades()
      return;
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    fetch(`https://ai-trading-journal-m373.onrender.com/trade/search/${searchQuery}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setTrades(data)
        setLoading(false)
      })
      .catch(err => {
        setTrades([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      const token = localStorage.getItem('token')
      fetch(`https://ai-trading-journal-m373.onrender.com/trade/delete/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(() => fetchTrades())
        .catch(err => console.error(err))
    }
  }

  const openCloseTradeModal = (trade) => {
    setEditingTrade(trade)
    setExitPrice(trade.exit || '')
    setUpdateNotes(trade.notes || '')
  }

  const handleCloseTradeSubmit = (e) => {
    e.preventDefault()
    if (!editingTrade) return

    const exitVal = Number(exitPrice)
    const entryVal = Number(editingTrade.entry)
    const qtyVal = Number(editingTrade.quantity)
    const isShort = editingTrade.trade_type === 'SHORT'
    
    // Calculate P&L
    const profit_loss = isShort 
      ? (entryVal - exitVal) * qtyVal 
      : (exitVal - entryVal) * qtyVal

    const token = localStorage.getItem('token')
    fetch(`https://ai-trading-journal-m373.onrender.com/trade/update/${editingTrade.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        exit_price: exitVal,
        profit_loss: profit_loss,
        notes: updateNotes
      })
    })
      .then(res => res.json())
      .then(() => {
        setEditingTrade(null)
        fetchTrades()
      })
      .catch(err => console.error(err))
  }

  const exportToCSV = () => {
    if (trades.length === 0) return
    const headers = ["Date", "Symbol", "Type", "Entry", "Exit", "Stop Loss", "Target", "Qty", "P&L", "Notes"]
    const rows = trades.map(t => [
      t.trade_date,
      t.symbol,
      t.trade_type,
      t.entry,
      t.exit || 'Open',
      t.stop_loss,
      t.target,
      t.quantity,
      t.profit_loss || 0,
      t.notes
    ])
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `trading_journal_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Trade History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review and audit all completed, sync'd, and demo trades.</p>
        </div>
        
        {/* Actions bar */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4px 8px' }}>
            <input 
              className="input-field" 
              placeholder="Search Symbol..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '180px', padding: '8px', boxShadow: 'none' }}
            />
            <button type="submit" className="btn outline" style={{ padding: '8px 12px', border: 'none', background: 'transparent', boxShadow: 'none' }}>
              <Search size={18} />
            </button>
          </form>
          
          <button className="btn outline" onClick={exportToCSV}>
            <Download size={18} style={{ marginRight: '4px' }} />
            Export CSV
          </button>

          <button className="btn" onClick={handleSyncExchanges} disabled={syncing}>
            🔄 {syncing ? 'Syncing...' : 'Sync Exchanges'}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '16px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>P&L</th>
              <th>Chart</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={trade.id} style={{ animation: `fadeIn 0.3s ease forwards`, animationDelay: `${index * 0.03}s`, opacity: 0 }}>
                <td style={{ color: 'var(--text-secondary)' }}>{trade.trade_date}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {trade.symbol.charAt(0)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600' }}>{trade.symbol}</span>
                      {trade.exchange_source && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          🔌 {trade.exchange_source}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${trade.trade_type === 'LONG' ? 'success' : 'danger'}`}>
                    {trade.trade_type}
                  </span>
                </td>
                <td>${trade.entry.toFixed(2)}</td>
                <td style={{ color: trade.exit ? 'white' : 'var(--text-secondary)' }}>
                  {trade.exit ? `$${trade.exit.toFixed(2)}` : 'Open'}
                </td>
                <td>
                  <span style={{ 
                    fontWeight: '600', 
                    color: trade.profit_loss > 0 ? 'var(--success)' : trade.profit_loss < 0 ? 'var(--danger)' : 'var(--text-secondary)' 
                  }}>
                    {trade.profit_loss > 0 ? '+' : ''}{trade.profit_loss.toFixed(2)}
                  </span>
                </td>
                <td>
                  {trade.screenshot ? (
                    <div 
                      onClick={() => setLightboxImage(trade.screenshot)}
                      style={{ width: '48px', height: '32px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img src={`https://ai-trading-journal-m373.onrender.com/uploads/${trade.screenshot}`} alt="Chart Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)' }}>-</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    {(!trade.exit || trade.exit === 0) && (
                      <button className="btn outline" style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'rgba(16, 185, 129, 0.4)', color: 'var(--success)' }} onClick={() => openCloseTradeModal(trade)}>
                        <CheckSquare size={14} style={{ marginRight: '4px' }} />
                        Close Trade
                      </button>
                    )}
                    <button className="btn outline danger" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleDelete(trade.id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                  <h3>No trades found.</h3>
                  <p style={{ marginTop: '8px' }}>Start by logging a new trade setup or clear search filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Close Trade Modal */}
      {editingTrade && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '30px', margin: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              onClick={() => setEditingTrade(null)}
            >
              <X size={20} />
            </button>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '4px' }}>Close Trade Setup</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Log execution parameters for symbol: <strong>{editingTrade.symbol}</strong></p>
            </div>
            <form onSubmit={handleCloseTradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label>Exit Price</label>
                <input 
                  type="number" 
                  step="any"
                  required 
                  className="input-field" 
                  placeholder="0.00" 
                  value={exitPrice} 
                  onChange={e => setExitPrice(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Exit Notes / Learnings</label>
                <textarea 
                  className="input-field" 
                  rows="3" 
                  placeholder="Notes on trade execution, exit trigger reason, etc." 
                  value={updateNotes} 
                  onChange={e => setUpdateNotes(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn outline" onClick={() => setEditingTrade(null)}>Cancel</button>
                <button type="submit" className="btn">💾 Save Execution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Lightbox Modal */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100
          }} 
          onClick={() => setLightboxImage(null)}
        >
          <button 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} 
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={`https://ai-trading-journal-m373.onrender.com/uploads/${lightboxImage}`} 
            alt="Screenshot Lightbox" 
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} 
            onClick={e => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  )
}
