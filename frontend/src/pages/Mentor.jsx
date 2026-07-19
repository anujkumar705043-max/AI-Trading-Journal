import { useState, useEffect, useRef } from 'react'
import { Send, Image as ImageIcon, X, Mic, Square } from 'lucide-react'

export default function Mentor() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Custom mentor persona config
  const [mentorCfg, setMentorCfg] = useState({
    mentor_name: 'Mentor AI',
    avatar_emoji: '👨‍🏫',
    personality: '',
    custom_rules: ''
  })

  // Chat Console States
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [sendingChat, setSendingChat] = useState(false)
  const chatEndRef = useRef(null)
  
  // Image attachment states
  const [chatImageFilename, setChatImageFilename] = useState('')
  const [chatImagePreview, setChatImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false)
  const [chatAudioFilename, setChatAudioFilename] = useState('')
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

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
        // Initialize default welcome message with the mentor audit speech!
        setMessages([
          { 
            sender: 'mentor', 
            text: result.mentor_speech || `Hello ${result.username || 'Trader'}! I am here to review your trades and analyze your screenshots using the UTS framework. Send a text, an image, or a voice note to begin.` 
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
    fetchMentorConfig()
  }, [])

  // Auto-scroll chat log
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle file screenshot upload for chat
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

  // Audio Recording Handlers
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

  // Send message to AI mentor
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  )

  const mentorName = data?.mentor_name || mentorCfg.mentor_name || 'Mentor AI'
  const mentorEmoji = data?.avatar_emoji || mentorCfg.avatar_emoji || '👨‍🏫'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
        <div>
          <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>{mentorEmoji}</span>
            {mentorName} Chat
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Upload trade screenshots and send voice notes directly to your AI Mentor.</p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-panel" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        padding: '0' 
      }}>
        
        {/* Chat History Area */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '30px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px' 
        }}>
          {messages.map((msg, idx) => {
            const isMentor = msg.sender === 'mentor'
            return (
              <div key={idx} style={{ 
                alignSelf: isMentor ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                display: 'flex',
                gap: '16px',
                flexDirection: isMentor ? 'row' : 'row-reverse'
              }}>
                {isMentor && (
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-color)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.2rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}>
                    {mentorEmoji}
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMentor ? 'flex-start' : 'flex-end', gap: '8px' }}>
                  {/* Attached Image Preview in Chat Bubble */}
                  {msg.imagePreview && (
                    <div style={{ 
                      maxWidth: '400px', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                    }}>
                      <img src={msg.imagePreview} alt="User Uploaded Screenshot" style={{ width: '100%', display: 'block' }} />
                    </div>
                  )}

                  {/* Audio Element in Chat Bubble */}
                  {msg.audioUrl && (
                    <div style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '8px 12px', 
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      marginBottom: '4px'
                    }}>
                      <audio controls src={msg.audioUrl} style={{ height: '36px', outline: 'none' }} />
                    </div>
                  )}

                  {msg.text && (
                    <div style={{ 
                      background: isMentor ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)',
                      border: isMentor ? '1px solid var(--border-color)' : 'none',
                      padding: '16px 20px',
                      borderRadius: '20px',
                      borderTopLeftRadius: isMentor ? '4px' : '20px',
                      borderTopRightRadius: isMentor ? '20px' : '4px',
                      color: isMentor ? 'var(--text-secondary)' : 'white',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {sendingChat && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                {mentorEmoji}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '20px', borderTopLeftRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="typing-dot" style={{ animationDelay: '0s' }}>.</span>
                <span className="typing-dot" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="typing-dot" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '20px 30px', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          background: 'rgba(0,0,0,0.2)' 
        }}>
          
          {/* Attachments Preview Area (Images & Audio) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: (chatImagePreview || chatAudioFilename) ? '16px' : '0' }}>
            
            {/* Image Preview Area */}
            {chatImagePreview && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ 
                  width: '120px', 
                  height: '80px', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  border: '2px solid var(--accent-color)'
                }}>
                  <img src={chatImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button 
                  type="button" 
                  onClick={() => { setChatImagePreview(''); setChatImageFilename('') }}
                  style={{ 
                    position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Audio Preview Area */}
            {chatAudioFilename && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ 
                  height: '80px',
                  padding: '0 24px',
                  borderRadius: '8px', 
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '2px solid var(--accent-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  <Mic size={24} style={{ color: 'var(--accent-color)' }} />
                  Voice Note Attached
                </div>
                <button 
                  type="button" 
                  onClick={() => setChatAudioFilename('')}
                  style={{ 
                    position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            
            {/* Attachment Button */}
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleChatFileChange} 
                style={{ display: 'none' }} 
                id="chat-image-upload" 
                disabled={isRecording}
              />
              <label 
                htmlFor="chat-image-upload" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: isRecording ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isRecording ? 0.5 : 1
                }}
                className="hover-bg-accent"
              >
                {uploadingImage ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <ImageIcon size={20} />}
              </label>
            </div>

            {/* Mic / Record Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={uploadingAudio}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', 
                border: '1px solid',
                borderColor: isRecording ? 'var(--danger)' : 'var(--border-color)',
                color: isRecording ? 'var(--danger)' : 'var(--text-secondary)',
                cursor: uploadingAudio ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                animation: isRecording ? 'pulse 1.5s infinite' : 'none'
              }}
              className="hover-bg-accent"
            >
              {uploadingAudio ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : (isRecording ? <Square size={20} /> : <Mic size={20} />)}
            </button>

            {/* Text Input */}
            <textarea 
              className="input-field"
              placeholder={isRecording ? "Recording audio..." : "Ask your Mentor about a setup, upload a screenshot, or send a voice note..."}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChatMessage(e);
                }
              }}
              disabled={sendingChat || uploadingImage || uploadingAudio || isRecording}
              style={{ 
                flex: 1, 
                padding: '14px 20px', 
                fontSize: '0.95rem',
                resize: 'none',
                height: '48px',
                minHeight: '48px',
                maxHeight: '120px',
                borderRadius: '12px',
                lineHeight: '1.4'
              }}
              rows="1"
            />
            
            {/* Send Button */}
            <button 
              type="submit" 
              className="btn" 
              style={{ 
                height: '48px', 
                padding: '0 24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                borderRadius: '12px',
                fontWeight: '600'
              }} 
              disabled={sendingChat || uploadingImage || uploadingAudio || isRecording || (!chatInput.trim() && !chatImageFilename && !chatAudioFilename)}
            >
              <Send size={18} /> <span style={{ display: 'none' }}>Send</span>
            </button>
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-accent:hover {
          background: rgba(99, 102, 241, 0.1) !important;
          color: var(--accent-color) !important;
          border-color: var(--accent-color) !important;
        }
        .typing-dot {
          animation: typing 1.4s infinite ease-in-out both;
          font-size: 1.5rem;
          line-height: 0.5;
        }
        @keyframes typing {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  )
}
