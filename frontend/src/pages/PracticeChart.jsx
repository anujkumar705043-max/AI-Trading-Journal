import React, { useState, useEffect, useRef } from 'react'
import { Send, Image as ImageIcon, X, Mic, Square, Maximize, Minimize, Bot, Search } from 'lucide-react'

export default function PracticeChart() {
  const container = useRef()
  const [symbolInput, setSymbolInput] = useState('')
  const [activeSymbol, setActiveSymbol] = useState('BINANCE:BTCUSDT')
  const [fullChart, setFullChart] = useState(false)
  const [showMentorPopup, setShowMentorPopup] = useState(false)

  // -- Mentor State & Logic --
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [sendingChat, setSendingChat] = useState(false)
  const chatEndRef = useRef(null)
  
  const [chatImageFilename, setChatImageFilename] = useState('')
  const [chatImagePreview, setChatImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [chatAudioFilename, setChatAudioFilename] = useState('')
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    setMessages([{ sender: 'mentor', text: "Hello! I am your AI Mentor. Ask me any doubts about the chart patterns you see here, or attach a screenshot/voice note." }])
  }, [])

  useEffect(() => {
    if (showMentorPopup) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, showMentorPopup])

  const handleChatFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setChatImagePreview(URL.createObjectURL(file))
    setUploadingImage(true)

    const formData = new FormData()
    formData.append('file', file)

    fetch('https://ai-trading-journal-m373.onrender.com/trade/upload-media', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      })
      .then(data => {
        setChatImageFilename(data.filename)
        setUploadingImage(false)
      })
      .catch(err => {
        console.error(err)
        alert('File upload failed.')
        setUploadingImage(false)
        setChatImagePreview('')
      })
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setUploadingAudio(true)

        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.webm')

        fetch('https://ai-trading-journal-m373.onrender.com/trade/upload-media', {
          method: 'POST',
          body: formData
        })
          .then(res => {
            if (!res.ok) throw new Error('Upload failed')
            return res.json()
          })
          .then(data => {
            setChatAudioFilename(data.filename)
            setUploadingAudio(false)
          })
          .catch(err => {
            console.error(err)
            alert('Audio upload failed.')
            setUploadingAudio(false)
          })
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Could not access microphone.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if ((!chatInput.trim() && !chatImageFilename && !chatAudioFilename) || sendingChat || uploadingImage || uploadingAudio || isRecording) return

    let userMessageText = chatInput.trim()
    if (!userMessageText) {
      if (chatAudioFilename && chatImageFilename) userMessageText = 'Analyzing this screenshot and voice note.'
      else if (chatAudioFilename) userMessageText = 'Voice note sent.'
      else if (chatImageFilename) userMessageText = 'Please analyze this screenshot.'
    }

    const currentFilename = chatImageFilename
    const currentPreview = chatImagePreview
    const currentAudioName = chatAudioFilename

    setMessages(prev => [...prev, { 
      sender: 'user', 
      text: userMessageText, 
      imagePreview: currentPreview,
      imageFilename: currentFilename,
      audioUrl: currentAudioName ? `https://ai-trading-journal-m373.onrender.com/uploads/${currentAudioName}` : null
    }])
    
    setChatInput('')
    setChatImageFilename('')
    setChatImagePreview('')
    setChatAudioFilename('')
    setSendingChat(true)

    const token = localStorage.getItem('token')
    const payload = {
      message: userMessageText,
      history: messages.map(m => ({ sender: m.sender, text: m.text })),
      image_filename: currentFilename || undefined,
      audio_filename: currentAudioName || undefined
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
        <>
          <div 
            onClick={() => setShowMentorPopup(false)}
            style={{
              position: 'fixed', top: 0, bottom: 0, left: 0, right: 0,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', zIndex: 10000
            }}
          />
          <div className="glass-panel" style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '450px', height: '600px', zIndex: 10001,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            padding: 0, overflow: 'hidden', borderRadius: '16px'
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>👨‍🏫</div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Mentor</h3>
              </div>
              <button onClick={() => setShowMentorPopup(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Chat History */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(11, 15, 25, 0.95)' }}>
              {messages.map((msg, idx) => {
                const isMentor = msg.sender === 'mentor'
                return (
                  <div key={idx} style={{ alignSelf: isMentor ? 'flex-start' : 'flex-end', maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    
                    {msg.imagePreview && (
                      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={msg.imagePreview} alt="Upload" style={{ width: '100%', display: 'block' }} />
                      </div>
                    )}

                    {msg.audioUrl && (
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <audio controls src={msg.audioUrl} style={{ height: '30px', width: '200px', outline: 'none' }} />
                      </div>
                    )}

                    {msg.text && (
                      <div style={{ 
                        background: isMentor ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)',
                        padding: '10px 14px', borderRadius: '16px',
                        borderTopLeftRadius: isMentor ? '4px' : '16px',
                        borderTopRightRadius: isMentor ? '16px' : '4px',
                        color: 'white', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-line'
                      }}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                )
              })}
              {sendingChat && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '16px', borderTopLeftRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: (chatImagePreview || chatAudioFilename) ? '10px' : '0' }}>
                {chatImagePreview && (
                  <div style={{ position: 'relative' }}>
                    <img src={chatImagePreview} alt="Preview" style={{ height: '60px', borderRadius: '4px', border: '1px solid var(--accent-color)' }} />
                    <button onClick={() => { setChatImagePreview(''); setChatImageFilename('') }} style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={10} /></button>
                  </div>
                )}
                {chatAudioFilename && (
                  <div style={{ position: 'relative', height: '60px', padding: '0 12px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', border: '1px solid var(--accent-color)', display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontSize: '0.8rem' }}>
                    <Mic size={16} style={{ color: 'var(--accent-color)' }} /> Audio
                    <button onClick={() => setChatAudioFilename('')} style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={10} /></button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ position: 'relative' }}>
                  <input type="file" accept="image/*" onChange={handleChatFileChange} style={{ display: 'none' }} id="popup-image-upload" disabled={isRecording} />
                  <label htmlFor="popup-image-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: isRecording ? 'not-allowed' : 'pointer' }}>
                    {uploadingImage ? <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div> : <ImageIcon size={16} />}
                  </label>
                </div>

                <button type="button" onClick={isRecording ? stopRecording : startRecording} disabled={uploadingAudio} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', border: 'none', color: isRecording ? 'var(--danger)' : 'var(--text-secondary)', cursor: uploadingAudio ? 'not-allowed' : 'pointer', animation: isRecording ? 'pulse 1.5s infinite' : 'none' }}>
                  {uploadingAudio ? <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div> : (isRecording ? <Square size={16} /> : <Mic size={16} />)}
                </button>

                <textarea 
                  className="input-field" placeholder={isRecording ? "Recording..." : "Ask your Mentor..."}
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChatMessage(e); } }}
                  disabled={sendingChat || uploadingImage || uploadingAudio || isRecording}
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', resize: 'none', height: '36px', minHeight: '36px', maxHeight: '80px', borderRadius: '8px', lineHeight: '1.4' }}
                  rows="1"
                />

                <button type="submit" className="btn" style={{ height: '36px', padding: '0 14px', borderRadius: '8px' }} disabled={sendingChat || uploadingImage || uploadingAudio || isRecording || (!chatInput.trim() && !chatImageFilename && !chatAudioFilename)}>
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
            .spinner { border-radius: 50%; border-top-color: var(--accent-color); animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}} />
        </>
      )}
    </div>
  )
}
