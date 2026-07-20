import React, { useState, useEffect, useRef } from 'react'
import { Send, Image as ImageIcon, X, Mic, Square, Maximize, Bot, Brush, Download } from 'lucide-react'

export default function AIMentorPopup({ onClose }) {
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
  
  const [isAnnotating, setIsAnnotating] = useState(false)

  const handleAnnotateImage = async () => {
    if (!chatImageFilename || isAnnotating) return;
    setIsAnnotating(true);
    const token = localStorage.getItem('token');
    
    // Optimistically add message
    const currentPreview = chatImagePreview;
    const currentFilename = chatImageFilename;
    setMessages(prev => [...prev, { sender: 'user', text: "Please annotate this chart.", imagePreview: currentPreview, imageFilename: currentFilename }]);
    setChatImagePreview('');
    setChatImageFilename('');
    setSendingChat(true);

    try {
      const res = await fetch('https://ai-trading-journal-m373.onrender.com/mentor/annotate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image_filename: currentFilename })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Annotation failed');
      
      setMessages(prev => [...prev, { 
        sender: 'mentor', 
        text: "Here is your annotated chart based on SMC concepts:", 
        imagePreview: `https://ai-trading-journal-m373.onrender.com/uploads/${data.annotated_image}`
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'mentor', text: `Failed to annotate chart. Reason: ${err.message}` }]);
    } finally {
      setIsAnnotating(false);
      setSendingChat(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    setMessages([{ sender: 'mentor', text: "Hello! I am your AI Mentor. Ask me any doubts about the chart patterns you see here, or attach a screenshot/voice note." }])
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  return (
    <>
      <div 
        onClick={onClose}
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
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(11, 15, 25, 0.95)' }}>
          {messages.map((msg, idx) => {
            const isMentor = msg.sender === 'mentor'
            return (
              <div key={idx} style={{ alignSelf: isMentor ? 'flex-start' : 'flex-end', maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                
                {msg.imagePreview && (
                  <div 
                    style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={(e) => { e.currentTarget.querySelector('.img-overlay').style.opacity = '1' }}
                    onMouseLeave={(e) => { e.currentTarget.querySelector('.img-overlay').style.opacity = '0' }}
                  >
                    <img src={msg.imagePreview} alt="Upload" style={{ width: '100%', display: 'block' }} />
                    <div className="img-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: 0, transition: 'opacity 0.2s ease', backdropFilter: 'blur(2px)' }}>
                      <button onClick={() => window.open(msg.imagePreview, '_blank')} style={{ background: 'var(--accent-color)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} title="View Full Screen" onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                        <Maximize size={16} />
                      </button>
                      <a href={msg.imagePreview} download={`chart_${idx}.png`} target="_blank" rel="noreferrer" style={{ background: 'var(--accent-color)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.2s' }} title="Download" onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                        <Download size={16} />
                      </a>
                    </div>
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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <img src={chatImagePreview} alt="Preview" style={{ height: '60px', borderRadius: '4px', border: '1px solid var(--accent-color)' }} />
                  <button onClick={() => { setChatImagePreview(''); setChatImageFilename('') }} style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={10} /></button>
                </div>
                <button 
                  type="button" 
                  onClick={handleAnnotateImage} 
                  disabled={isAnnotating || uploadingImage}
                  style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid #c084fc', borderRadius: '6px', fontSize: '0.8rem', cursor: (isAnnotating || uploadingImage) ? 'not-allowed' : 'pointer', fontWeight: 'bold', alignSelf: 'center' }}>
                  {isAnnotating ? <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderTopColor: '#c084fc' }}></div> : <Brush size={14} />}
                  AI Annotate
                </button>
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
  )
}
