import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import TaskCard, { statuses } from './components/task-card'


function App() {
  const [tasks, setTasks] = useState([])
  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: tasksInColumn
    }
  })

  useEffect(() => {
    fetch('http://localhost:3000/tasks').then((res) => res.json()).then((data) => {
      setTasks(data)
    })
}, [])
  

  const updateTask = (task) => {
    fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t
    })
    setTasks(updatedTasks)
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    setCurrentlyHoveringOver(null)
    const id = e.dataTransfer.getData("id")
    const task = tasks.find((task) => task.id === id)
    if(task) {
      updateTask({...task, status})
    }
  }
  
  const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState(null)
  const handleDragEnter = (status) => {
    console.log('drag enter', status)
    setCurrentlyHoveringOver(status)
  }

  return (
  <div className="container-fluid mt-4">
    <div className="row">
      {columns.map((column) => (
      <div
      onDrop={(e) => handleDrop(e, column.status)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => handleDragEnter(column.status)}
      className="col-md-3 border-end"
      >
          <h1 className="d-flex justify-content-between align-items-center mb-3 px-2 fw-bold text-secondary-emphasis">
            <h1 className="text-capitalize  m-0">{column.status}</h1>
            {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
          </h1>
          <div className={`h-100 ${currentlyHoveringOver === column.status ? 'bg-secondary-subtle' : ''}`}>
            {column.tasks.map((task) => (
              <TaskCard
              task={task}
              updateTask={updateTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)
}

export default App

