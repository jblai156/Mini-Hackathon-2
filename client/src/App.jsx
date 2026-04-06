import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:8080'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const messagesContainerRef = useRef(null)

  const loadMessages = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/messages`)
      if (!response.ok) {
        throw new Error('Failed to load messages.')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    if (!messagesContainerRef.current) return
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }, [messages, isLoading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    setIsSending(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message.')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, data.message])
      setInput('')
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setIsSending(false)
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    sendMessage()
  }

  return (
    <main style={{ maxWidth: '640px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Chat</h1>

      <section
        ref={messagesContainerRef}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          height: '320px',
          overflowY: 'auto',
          padding: '1rem',
          marginBottom: '1rem',
          background: '#fff',
          color: '#111',
        }}
      >
        {isLoading ? (
          <p style={{ opacity: 0.6 }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No messages yet. Send one below.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {messages.map((message) => (
              <li
                key={message.id}
                style={{
                  padding: '0.6rem 0.8rem',
                  marginBottom: '0.6rem',
                  borderRadius: '6px',
                  background: '#f3f4f6',
                }}
              >
                <div>{message.text}</div>
                <small style={{ opacity: 0.6 }}>
                  {new Date(message.sentAt).toLocaleTimeString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          style={{ flex: 1, padding: '0.75rem' }}
          disabled={isSending}
        />
        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </main>
  )
}

export default App
