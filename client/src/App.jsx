import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import BoardView from './views/BoardView'
import CalendarView from './views/CalendarView.jsx'
import ChatView from './views/ChatView'

function App() {
  const [activeView, setActiveView] = useState('board')

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-3">
        <span className="navbar-brand fw-bold">Super Awesome Group</span>

        <div className="d-flex gap-2 ms-auto">
          <button
            className={`btn ${activeView === 'board' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveView('board')}
          >
            Board
          </button>

          <button
            className={`btn ${activeView === 'calendar' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveView('calendar')}
          >
            Calendar
          </button>

          <button
            className={`btn ${activeView === 'chat' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveView('chat')}
          >
            Chat
          </button>
        </div>
      </nav>

      <main className="p-3">
        {activeView === 'board' && <BoardView />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'chat' && <ChatView />}
      </main>
    </div>
  )
}

export default App