import { useEffect, useRef, useState } from 'react'

const API_BASE_URL = 'http://localhost:8080'

function ChatView() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const messagesContainerRef = useRef(null)

  const loadMessages = async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/messages`)
      if (!response.ok) {
        throw new Error('Failed to load messages.')
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setError('')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadMessages({ showLoader: true })

    const pollIntervalId = window.setInterval(() => {
      loadMessages()
    }, 2000)

    return () => {
      window.clearInterval(pollIntervalId)
    }
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
        body: JSON.stringify({ text, sender: 'me' }),
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
            {messages.map((message) => {
              const isMine = message.sender === 'me'

              return (
                <li
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                    marginBottom: '0.6rem',
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '10px',
                      maxWidth: '80%',
                      background: isMine ? '#2563eb' : '#e5e7eb',
                      color: isMine ? '#ffffff' : '#111827',
                    }}
                  >
                    <div>{message.text}</div>
                    <small style={{ opacity: isMine ? 0.85 : 0.65 }}>
                      {new Date(message.sentAt).toLocaleTimeString()}
                    </small>
                  </div>
                </li>
              )
            })}
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

export default ChatView