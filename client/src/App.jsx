import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        sentAt: new Date().toLocaleTimeString(),
      },
    ])
    setInput('')
  }

  const onSubmit = (event) => {
    event.preventDefault()
    sendMessage()
  }

  return (
    <main style={{ maxWidth: '640px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Simple Chat</h1>

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          minHeight: '220px',
          padding: '1rem',
          marginBottom: '1rem',
          background: '#fff',
          color: '#111',
        }}
      >
        {messages.length === 0 ? (
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
                <small style={{ opacity: 0.6 }}>{message.sentAt}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          style={{ flex: 1, padding: '0.75rem' }}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}

export default App
