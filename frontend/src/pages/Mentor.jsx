import { useState, useEffect, useRef } from 'react'
import { GraduationCap, CheckSquare, RefreshCw, AlertTriangle, Shield, Play, Send, Plus, Save } from 'lucide-react'

export default function Mentor() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Custom mentor persona config
  const [mentorCfg, setMentorCfg] = useState({
    mentor_name: 'Mentor AI',
    avatar_emoji: '👨\u200d🏫',
    personality: '',
    custom_rules: ''
  })

  // Sub tab selection
  const [activeSubTab, setActiveSubTab] = useState('review') // 'review' or 'analyze'

  // Chat Console States
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [sendingChat, setSendingChat] = useState(false)
  const chatEndRef = useRef(null)

  // Manual Trade Logging Form States (from AddTrade)
  const [formData, setFormData] = useState({
    symbol: '',
    trade_type: 'LONG',
    entry: '',
    exit_price: '',
    stop_loss: '',
    target: '',
    quantity: '',
    risk_percent: '',
    capital: '',
    trade_date: new Date().toISOString().split('T')[0],
    notes: '',
    screenshot: ''
  })
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [setups, setSetups] = useState([])
  const [selectedSetupId, setSelectedSetupId] = useState('')
  const [followedRuleIds, setFollowedRuleIds] = useState([])

  const fetchMentorAudit = () => {
    setLoading(true)
    setError(null)
    const token = localStorage.getItem('token')

    fetch('https://ai-trading-journal-m373.onrender.com/mentor/insights', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to reach your AI Mentor. Make sure the server is online.')
        return res.json()
      })
      .then(result => {
        setData(result)
        // Initialize default welcome message if chat history is empty
        setMessages([
          { 
            sender: 'mentor', 
            text: `Hello ${result.username || 'Trader'}! I have completed your performance audit. Ask me any question about your risk metrics, rules compliance, or confluences, and let's work on your execution discipline.` 
          }
        ])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }

  // Load setups on load
  const fetchSetups = () => {
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/setups', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSetups(data))
      .catch(err => console.error(err))
  }

  const fetchMentorConfig = () => {
    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/mentor/config', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(cfg => { if (cfg.mentor_name) setMentorCfg(cfg) })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchMentorAudit()
    fetchSetups()
    fetchMentorConfig()
  }, [])

  // Auto-scroll chat log
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message to AI mentor
  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || sendingChat) return

    const userMessageText = chatInput.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMessageText }])
    setChatInput('')
    setSendingChat(true)

    const token = localStorage.getItem('token')
    const payload = {
      message: userMessageText,
      history: messages.map(m => ({ sender: m.sender, text: m.text }))
    }

    fetch('https://ai-trading-journal-m373.onrender.com/mentor/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, { sender: 'mentor', text: data.reply }])
        setSendingChat(false)
      })
      .catch(err => {
        console.error(err)
        setMessages(prev => [...prev, { sender: 'mentor', text: "Sorry, I lost my connection to the AI mentor module. Check your API settings." }])
        setSendingChat(false)
      })
  }

  // Handle file screenshot upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)

    const data = new FormData()
    data.append('file', file)

    fetch('https://ai-trading-journal-m373.onrender.com/trade/upload-screenshot', {
      method: 'POST',
      body: data
    })
      .then(res => {
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      })
      .then(data => {
        setFormData(prev => ({ ...prev, screenshot: data.filename }))
        setUploading(false)
      })
      .catch(err => {
        console.error(err)
        alert('File upload failed. Only images are supported.')
        setUploading(false)
        setPreviewUrl('')
      })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }))
  }

  // Submit manual trade logs
  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    const payload = {
      ...formData,
      entry: Number(formData.entry),
      exit_price: Number(formData.exit_price) || 0,
      stop_loss: Number(formData.stop_loss),
      target: Number(formData.target),
      quantity: Number(formData.quantity),
      risk_percent: Number(formData.risk_percent),
      capital: Number(formData.capital),
      setup_id: selectedSetupId ? Number(selectedSetupId) : null,
      followed_rule_ids: followedRuleIds
    }

    const token = localStorage.getItem('token')
    fetch('https://ai-trading-journal-m373.onrender.com/trade/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Failed to save trade');
        }
        return res.json();
      })
      .then(() => {
        // Reset Form
        setFormData({
          symbol: '',
          trade_type: 'LONG',
          entry: '',
          exit_price: '',
          stop_loss: '',
          target: '',
          quantity: '',
          risk_percent: '',
          capital: '',
          trade_date: new Date().toISOString().split('T')[0],
          notes: '',
          screenshot: ''
        })
        setPreviewUrl('')
        setSelectedSetupId('')
        setFollowedRuleIds([])
        
        // Go back to critique tab and refresh AI insights
        setActiveSubTab('review')
        fetchMentorAudit()
        alert('Trade logged successfully for self-audit!')
      })
      .catch(err => {
        console.error(err);
        alert('Error saving trade: ' + err.message);
      })
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  )

  const username = data?.username || 'Trader'
  const mentorName = data?.mentor_name || mentorCfg.mentor_name || 'Mentor AI'
  const mentorEmoji = data?.avatar_emoji || mentorCfg.avatar_emoji || '👨\u200d🏫'
  const activeSetup = setups.find(s => s.id === Number(selectedSetupId))

  return (
    <div>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>{mentorEmoji}</span>
            {mentorName}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your custom AI Mentor — log setups under self-audit and get live coaching critiques.</p>
        </div>
      </div>

      {/* Sub Tab selection bar */}
      <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '14px', marginBottom: '30px', maxWidth: '400px' }}>
        <button
          onClick={() => setActiveSubTab('review')}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderRadius: '10px',
            background: activeSubTab === 'review' ? 'var(--accent-color)' : 'transparent',
            color: activeSubTab === 'review' ? 'white' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Mentor Review & Chat
        </button>
        <button
          onClick={() => setActiveSubTab('analyze')}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderRadius: '10px',
            background: activeSubTab === 'analyze' ? 'var(--accent-color)' : 'transparent',
            color: activeSubTab === 'analyze' ? 'white' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Analyze New Trade
        </button>
      </div>

      {activeSubTab === 'review' ? (
        /* ================= REVIEW TAB ================= */
        <div>
          {error || !data || data.status === 'insufficient_data' ? (
            <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '20px' }}>{mentorEmoji}</div>
              <h2>{mentorName}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                {data?.message || "I don't have enough trading history to audit your setups. Click the 'Analyze New Trade' tab above to manually log completed trades first!"}
              </p>
              <button className="btn" onClick={() => setActiveSubTab('analyze')}><Plus size={16} style={{ marginRight: '4px' }} /> Analyze a Trade</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
                
                {/* Left Column: Mentor Speech Bubble & Grade */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  
                  {/* Mentor Profile & Direct Critique */}
                  <div className="glass-panel" style={{ padding: '35px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}>
                        {mentorEmoji}
                      </div>
                      <div>
                        <h3 style={{ color: 'white', margin: 0 }}>{mentorName}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: '600' }}>Your Custom AI Trading Mentor</span>
                      </div>
                    </div>

                    {/* Mentor Grade Badge */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      background: 'rgba(255,255,255,0.02)', 
                      padding: '16px', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.04)',
                      marginBottom: '24px'
                    }}>
                      <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '900', 
                        color: data.mentor_grade === 'A' ? 'var(--success)' : data.mentor_grade === 'B' ? '#10b981' : data.mentor_grade === 'C' ? '#f59e0b' : 'var(--danger)',
                        lineHeight: 1
                      }}>
                        {data.mentor_grade}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mentor Evaluation Grade</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white' }}>{data.mentor_grade_desc}</div>
                      </div>
                    </div>

                    {/* Speech Critique */}
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.95rem', 
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line'
                    }}>
                      {data.mentor_speech}
                    </div>
                  </div>

                  {/* Metrics audited */}
                  <div className="glass-panel" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Expectancy Index</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: expectancy >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {expectancy >= 0 ? '+' : ''}${expectancy.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Average Risk size</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: avg_risk_percent <= 2.0 ? 'var(--success)' : 'var(--danger)' }}>
                        {avg_risk_percent}%
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Weekly Tasks & Warnings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  
                  {/* Weekly Tasks Assigned */}
                  <div className="glass-panel" style={{ padding: '35px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <CheckSquare size={24} style={{ color: 'var(--accent-color)' }} />
                      <h3 style={{ margin: 0, color: 'white' }}>Mentor's Assigned Tasks</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {weekly_plan.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ 
                            marginTop: '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: '2px solid var(--accent-color)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-color)',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            flexShrink: 0
                          }}>
                            ✓
                          </div>
                          <div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px' }}>
                              Goal #{idx + 1}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: '1.4' }}>
                              {item}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance alerts */}
                  {compliance_insights && compliance_insights.length > 0 && (
                    <div className="glass-panel" style={{ padding: '35px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
                        <h3 style={{ margin: 0, color: 'white' }}>Rule Compliance Warnings</h3>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 20px 0' }}>
                        Rules that you have broken. Follow them to avoid capital loss:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {compliance_insights.map((insight, idx) => (
                          <div key={idx} style={{ 
                            padding: '14px', 
                            background: 'rgba(239, 68, 68, 0.04)', 
                            borderLeft: '3px solid var(--danger)', 
                            borderRadius: '8px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: 'white', marginBottom: '6px' }}>
                              <span>{insight.setup_name} ➔ {insight.rule_text}</span>
                              <span style={{ color: 'var(--danger)' }}>{insight.compliance_rate}% followed</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              {insight.warning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Chat Console */}
              <div className="glass-panel" style={{ padding: '30px', marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                  <div style={{ fontSize: '1.6rem' }}>💬</div>
                  <div>
                    <h3 style={{ color: 'white', margin: 0 }}>Consult AI Mentor</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chat directly with your mentor about confluences, psychology, and performance refinement</span>
                  </div>
                </div>

                <div style={{ 
                  height: '280px', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  padding: '16px', 
                  background: 'rgba(0,0,0,0.15)', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  {messages.map((msg, idx) => {
                    const isMentor = msg.sender === 'mentor'
                    return (
                      <div key={idx} style={{ 
                        alignSelf: isMentor ? 'flex-start' : 'flex-end',
                        maxWidth: '75%',
                        display: 'flex',
                        gap: '10px',
                        flexDirection: isMentor ? 'row' : 'row-reverse'
                      }}>
                        {isMentor && (
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: 'var(--accent-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '0.85rem',
                            flexShrink: 0
                          }}>
                            👨‍🏫
                          </div>
                        )}
                        <div style={{ 
                          background: isMentor ? 'rgba(255,255,255,0.03)' : 'var(--accent-color)',
                          border: isMentor ? '1px solid var(--border-color)' : 'none',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          borderTopLeftRadius: isMentor ? '4px' : '16px',
                          borderTopRightRadius: isMentor ? '16px' : '4px',
                          color: isMentor ? 'var(--text-secondary)' : 'white',
                          fontSize: '0.88rem',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-line'
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    )
                  })}
                  {sendingChat && (
                    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                        👨‍🏫
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        Evaluating your data. Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    className="input-field"
                    placeholder="Ask your Mentor e.g. Why am I losing on mean reversion? How can I reduce FOMO?"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={sendingChat}
                    style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem' }}
                  />
                  <button type="submit" className="btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={sendingChat}>
                    <Send size={16} /> Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= ANALYZE TRADE TAB (MANUAL LOG FORM) ================= */
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 6px 0', color: 'white' }}>Self-Audit Trading Form</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Fill in confluences, checklists, and notes to evaluate your execution quality.</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="glass-panel" style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              
              <div className="input-group">
                <label>Ticker Symbol</label>
                <input type="text" className="input-field" name="symbol" value={formData.symbol} onChange={handleFormChange} placeholder="e.g. BTCUSD" />
              </div>

              <div className="input-group">
                <label>Direction</label>
                <select className="input-field" name="trade_type" value={formData.trade_type} onChange={handleFormChange}>
                  <option value="LONG">LONG (Buy)</option>
                  <option value="SHORT">SHORT (Sell)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Execution Date</label>
                <input type="date" className="input-field" name="trade_date" value={formData.trade_date} onChange={handleFormChange} />
              </div>

              <div className="input-group">
                <label>Entry Price</label>
                <input type="number" step="any" className="input-field" name="entry" value={formData.entry} onChange={handleFormChange} placeholder="0.00" />
              </div>

              <div className="input-group">
                <label>Position Size (Qty)</label>
                <input type="number" step="any" className="input-field" name="quantity" value={formData.quantity} onChange={handleFormChange} placeholder="0" />
              </div>

              <div className="input-group">
                <label>Stop Loss Level</label>
                <input type="number" step="any" className="input-field" name="stop_loss" value={formData.stop_loss} onChange={handleFormChange} placeholder="0.00" />
              </div>

              <div className="input-group">
                <label>Take Profit Target</label>
                <input type="number" step="any" className="input-field" name="target" value={formData.target} onChange={handleFormChange} placeholder="0.00" />
              </div>

              <div className="input-group">
                <label>Account Capital</label>
                <input type="number" step="any" className="input-field" name="capital" value={formData.capital} onChange={handleFormChange} placeholder="$0.00" />
              </div>

              <div className="input-group">
                <label>Risk Percentage (%)</label>
                <input type="number" step="any" className="input-field" name="risk_percent" value={formData.risk_percent} onChange={handleFormChange} placeholder="1.0" />
              </div>

              {/* Setups selector */}
              <div className="input-group">
                <label>Trading Setup Model</label>
                <select 
                  className="input-field" 
                  value={selectedSetupId} 
                  onChange={e => {
                    setSelectedSetupId(e.target.value)
                    setFollowedRuleIds([]) // Reset rules
                  }}
                >
                  <option value="">Select a Setup...</option>
                  {setups.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Rules checkboxes */}
              {activeSetup && (
                <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '10px', background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                  <label style={{ color: 'white', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Rules Compliance Checklist</label>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: '0 0 16px 0' }}>
                    Check off every rule that was strictly satisfied BEFORE execution:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeSetup.rules.map(rule => (
                      <label key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={followedRuleIds.includes(rule.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFollowedRuleIds([...followedRuleIds, rule.id])
                            } else {
                              setFollowedRuleIds(followedRuleIds.filter(id => id !== rule.id))
                            }
                          }}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-color)' }}
                        />
                        <span>{rule.rule_text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                <label>Exit Price <span style={{ textTransform: 'none', color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Optional, leave blank if open)</span></label>
                <input type="number" step="any" className="input-field" name="exit_price" value={formData.exit_price} placeholder="0.00" onChange={handleFormChange} />
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Trade Notes / Self Analysis</label>
                <textarea className="input-field" name="notes" value={formData.notes} onChange={handleFormChange} rows="4" placeholder="Perform your mentor analysis: write down trigger events, market confluences, and execution errors..."></textarea>
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                <label>Trade Screenshot / Chart Setup</label>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    id="screenshot-upload-mentor" 
                  />
                  <label htmlFor="screenshot-upload-mentor" className="btn outline" style={{ margin: 0, textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer' }}>
                    📁 {uploading ? 'Uploading...' : 'Choose Chart Image'}
                  </label>
                  
                  {previewUrl && (
                    <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => { setPreviewUrl(''); setFormData(prev => ({ ...prev, screenshot: '' })) }}
                        style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px' }}>
              <button type="button" className="btn outline" onClick={() => setActiveSubTab('review')}>Cancel</button>
              <button type="submit" className="btn" style={{ padding: '12px 32px' }}><Save size={16} style={{ marginRight: '4px' }} /> Save Self-Audit Trade</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
