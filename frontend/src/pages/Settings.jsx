import { useState, useEffect } from 'react'
import { Key, Save, Trash2, CheckCircle, HelpCircle, Bot, Sparkles } from 'lucide-react'

export default function Settings() {
  const [keys, setKeys] = useState({
    binance: { exists: false, api_key: '' },
    bybit: { exists: false, api_key: '' },
    okx: { exists: false, api_key: '' },
    delta_india: { exists: false, api_key: '' },
    shark: { exists: false, api_key: '' },
    gemini_api: { exists: false, api_key: '' }
  })
  
  const [activeForm, setActiveForm] = useState({
    binance: { api_key: '', api_secret: '', passphrase: '' },
    bybit: { api_key: '', api_secret: '', passphrase: '' },
    okx: { api_key: '', api_secret: '', passphrase: '' },
    delta_india: { api_key: '', api_secret: '', passphrase: '' },
    shark: { api_key: '', api_secret: '', passphrase: '' },
    gemini_api: { api_key: '', api_secret: '', passphrase: '' }
  })

  const [loading, setLoading] = useState(true)

  // Custom AI Mentor Config
  const [mentorCfg, setMentorCfg] = useState({
    mentor_name: 'Mentor AI',
    avatar_emoji: '👨\u200d🏫',
    personality: 'Professional, strict, and encouraging',
    custom_rules: ''
  })
  const [mentorSaving, setMentorSaving] = useState(false)
  const [mentorSaved, setMentorSaved] = useState(false)

  const fetchCredentials = () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    
    fetch('http://localhost:8000/exchanges/credentials', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setKeys({
          binance: { exists: !!data.binance, api_key: data.binance?.api_key || '' },
          bybit: { exists: !!data.bybit, api_key: data.bybit?.api_key || '' },
          okx: { exists: !!data.okx, api_key: data.okx?.api_key || '' },
          delta_india: { exists: !!data.delta_india, api_key: data.delta_india?.api_key || '' },
          shark: { exists: !!data.shark, api_key: data.shark?.api_key || '' },
          gemini_api: { exists: !!data.gemini_api, api_key: data.gemini_api?.api_key || '' }
        })
        setActiveForm({
          binance: { api_key: data.binance?.api_key || '', api_secret: '', passphrase: '' },
          bybit: { api_key: data.bybit?.api_key || '', api_secret: '', passphrase: '' },
          okx: { api_key: data.okx?.api_key || '', api_secret: '', passphrase: data.okx?.passphrase || '' },
          delta_india: { api_key: data.delta_india?.api_key || '', api_secret: '', passphrase: '' },
          shark: { api_key: data.shark?.api_key || '', api_secret: '', passphrase: '' },
          gemini_api: { api_key: data.gemini_api?.api_key || '', api_secret: '', passphrase: '' }
        })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const fetchMentorConfig = () => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/mentor/config', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.mentor_name) setMentorCfg(data)
      })
      .catch(err => console.error(err))
  }

  const saveMentorConfig = () => {
    const token = localStorage.getItem('token')
    setMentorSaving(true)
    fetch('http://localhost:8000/mentor/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(mentorCfg)
    })
      .then(res => res.json())
      .then(() => {
        setMentorSaving(false)
        setMentorSaved(true)
        setTimeout(() => setMentorSaved(false), 3000)
      })
      .catch(err => { console.error(err); setMentorSaving(false) })
  }

  useEffect(() => {
    fetchCredentials()
    fetchMentorConfig()
  }, [])

  const handleSave = (exchangeName) => {
    const token = localStorage.getItem('token')
    const payload = {
      exchange_name: exchangeName,
      api_key: activeForm[exchangeName].api_key,
      api_secret: activeForm[exchangeName].api_secret || 'empty',
      passphrase: activeForm[exchangeName].passphrase || 'empty'
    }

    fetch('http://localhost:8000/exchanges/credentials', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        alert(`${exchangeName.replace('_', ' ').toUpperCase()} credentials saved successfully!`)
        fetchCredentials()
      })
      .catch(err => console.error(err))
  }

  const handleDelete = (exchangeName) => {
    const token = localStorage.getItem('token')
    if (confirm(`Are you sure you want to delete your ${exchangeName.replace('_', ' ').toUpperCase()} credentials?`)) {
      fetch(`http://localhost:8000/exchanges/credentials/${exchangeName}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(() => {
          fetchCredentials()
        })
        .catch(err => console.error(err))
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  )

  const exchangesList = [
    { id: 'binance', name: 'Binance API', desc: 'Binance Spot Fills Client', icon: '🟠' },
    { id: 'bybit', name: 'Bybit API', desc: 'Bybit Unified executions client', icon: '🟡' },
    { id: 'okx', name: 'OKX API', desc: 'OKX Spot & Margin fills client', icon: '⚫', needPassphrase: true },
    { id: 'delta_india', name: 'Delta Exchange India', desc: 'Delta India derivative fills client', icon: '🇮🇳' },
    { id: 'shark', name: 'Shark Exchange', desc: 'Mock broker sync client', icon: '🦈' }
  ]

  const exKeyGemini = keys['gemini_api']
  const formGemini = activeForm['gemini_api']

  const avatarOptions = ['👨\u200d🏫', '🤖', '🧠', '🦅', '🏴\u200d☠️', '🎯', '⚡', '🔥', '🦁', '🐉', '🧙', '👁️', '🪖', '💎', '🌊']

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '8px' }}>System Configurations</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure broker API credentials, LLM services, and your custom AI Mentor persona.</p>
      </div>

      {/* ===== Custom AI Mentor Builder ===== */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', border: '1px solid rgba(139,92,246,0.3)', background: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(99,102,241,0.04) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Customize Your AI Mentor</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Design your mentor's personality, name, and trading strategy guidelines</p>
          </div>
          {mentorSaved && (
            <span className="badge success" style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Saved!
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Mentor Name</label>
              <input
                className="input-field"
                placeholder="e.g. Captain Risk, Sensei, The Oracle..."
                value={mentorCfg.mentor_name}
                onChange={e => setMentorCfg({ ...mentorCfg, mentor_name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Avatar Emoji</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {avatarOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setMentorCfg({ ...mentorCfg, avatar_emoji: emoji })}
                    style={{
                      width: '42px', height: '42px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      fontSize: '1.3rem', background: mentorCfg.avatar_emoji === emoji
                        ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                        : 'rgba(255,255,255,0.06)',
                      transition: 'all 0.15s ease',
                      transform: mentorCfg.avatar_emoji === emoji ? 'scale(1.15)' : 'scale(1)'
                    }}
                  >{emoji}</button>
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selected: <strong style={{ color: 'white' }}>{mentorCfg.avatar_emoji} {mentorCfg.mentor_name}</strong></span>
            </div>

            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Personality Style</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="e.g. Extremely strict and no-nonsense. Talks like a disciplined military commander. Hates FOMO trades."
                value={mentorCfg.personality}
                onChange={e => setMentorCfg({ ...mentorCfg, personality: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                <Sparkles size={13} style={{ marginRight: '6px', verticalAlign: 'middle', color: '#a78bfa' }} />
                My Custom Strategy Rules
              </label>
              <textarea
                className="input-field"
                rows={8}
                placeholder={`Write your personal strategy guidelines here. The AI will enforce them strictly.\n\nExamples:\n• Never risk more than 1.5% per trade\n• Only trade with RSI confluence\n• Warn me if I take more than 2 trades a day\n• Penalize revenge trading severely`}
                value={mentorCfg.custom_rules}
                onChange={e => setMentorCfg({ ...mentorCfg, custom_rules: e.target.value })}
                style={{ resize: 'vertical', minHeight: '180px' }}
              />
              <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>These rules are injected directly into every AI performance audit and chat session.</p>
            </div>

            <button
              className="btn"
              style={{ padding: '12px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: mentorSaving ? 0.7 : 1 }}
              onClick={saveMentorConfig}
              disabled={mentorSaving}
            >
              {mentorSaving ? '⏳ Saving...' : <><Save size={16} /> Save My AI Mentor</>}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Gemini Live AI Mentor Key config */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🧠</span>
              <div>
                <h3 style={{ color: 'white', margin: 0 }}>AI Mentor (Google Gemini)</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live LLM Mentorship Service</span>
              </div>
            </div>
            {exKeyGemini?.exists && (
              <span className="badge success" style={{ padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} /> Activated
              </span>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <HelpCircle size={16} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' }} />
            <span>Generate a free Gemini API Key from Google AI Studio to unlock live interactive reviews and direct performance chats!</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group">
              <label>Gemini API Key</label>
              <input 
                type="password"
                className="input-field" 
                placeholder={exKeyGemini?.exists ? "Configured (••••••••)" : "Enter Gemini API Key"} 
                value={formGemini.api_key} 
                onChange={e => setActiveForm({
                  ...activeForm,
                  gemini_api: { ...formGemini, api_key: e.target.value }
                })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button className="btn" style={{ flex: 1, padding: '10px' }} onClick={() => handleSave('gemini_api')}>
              <Save size={16} style={{ marginRight: '4px' }} /> Activate Mentor
            </button>
            {exKeyGemini?.exists && (
              <button className="btn outline danger" style={{ padding: '10px 16px' }} onClick={() => handleDelete('gemini_api')}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Existing Exchanges */}
        {exchangesList.map(ex => {
          const exKey = keys[ex.id]
          const form = activeForm[ex.id]
          return (
            <div key={ex.id} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{ex.icon}</span>
                  <div>
                    <h3 style={{ color: 'white', margin: 0 }}>{ex.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ex.desc}</span>
                  </div>
                </div>
                {exKey?.exists && (
                  <span className="badge success" style={{ padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Connected
                  </span>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <HelpCircle size={16} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' }} />
                <span>Enter <code>mock</code> as API Key to synchronize realistic demo executions instantly.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label>API Key</label>
                  <input 
                    className="input-field" 
                    placeholder={exKey?.exists ? "Configured (••••••••)" : "Enter API Key"} 
                    value={form.api_key} 
                    onChange={e => setActiveForm({
                      ...activeForm,
                      [ex.id]: { ...form, api_key: e.target.value }
                    })}
                  />
                </div>
                <div className="input-group">
                  <label>API Secret</label>
                  <input 
                    type="password"
                    className="input-field" 
                    placeholder={exKey?.exists ? "Configured (••••••••)" : "Enter API Secret"} 
                    value={form.api_secret} 
                    onChange={e => setActiveForm({
                      ...activeForm,
                      [ex.id]: { ...form, api_secret: e.target.value }
                    })}
                  />
                </div>
                {ex.needPassphrase && (
                  <div className="input-group">
                    <label>Passphrase</label>
                    <input 
                      type="password"
                      className="input-field" 
                      placeholder={exKey?.exists ? "Configured (••••••••)" : "Enter Passphrase"} 
                      value={form.passphrase} 
                      onChange={e => setActiveForm({
                        ...activeForm,
                        [ex.id]: { ...form, passphrase: e.target.value }
                      })}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button className="btn" style={{ flex: 1, padding: '10px' }} onClick={() => handleSave(ex.id)}>
                  <Save size={16} style={{ marginRight: '4px' }} /> Save Keys
                </button>
                {exKey?.exists && (
                  <button className="btn outline danger" style={{ padding: '10px 16px' }} onClick={() => handleDelete(ex.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
