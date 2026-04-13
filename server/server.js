const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 8080

const corsOptions = {
  origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions))
app.use(express.json())

const messages = []

app.get('/api', (req, res) => {
  res.json({ fruits: ['apple', 'orange', 'banana'] })
})

app.get('/messages', (req, res) => {
  res.json({ messages })
})

app.post('/messages', (req, res) => {
  const text = req.body?.text?.trim()

  if (!text) {
    return res.status(400).json({ error: 'Message text is required.' })
  }

  const message = {
    id: crypto.randomUUID(),
    text,
    sentAt: new Date().toISOString(),
  }

  messages.push(message)
  return res.status(201).json({ message })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})