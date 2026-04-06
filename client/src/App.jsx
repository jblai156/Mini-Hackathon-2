import './App.css'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard, { tasks as initialTasks, statuses } from './components/task-card'


function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      title: status,
      tasks: tasksInColumn
    }
  })

  const todoTasks = tasks.filter((task) => task.status === 'todo')
  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress')
  const doneTasks = tasks.filter((task) => task.status === 'done')

  const updateTask = (task) => {
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t
    })
    setTasks(updatedTasks)
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("id")
    const task = tasks.find((task) => task.id === id)
    if(task) {
      updateTask({...task, status})
    }
  }
  
  return (
  <div className="container-fluid mt-4">
    <div className="row">
      {columns.map((column) => (
      <div
      onDrop={(e) => handleDrop(e, column.title)}
      onDragOver={(e) => e.preventDefault()} 
      className="col-md-3 border-end"
      >
          <h1 className="d-flex justify-content-between align-items-center mb-3 px-2 fw-bold text-secondary-emphasis">
            <h1 className="text-capitalize  m-0">{column.title}</h1>
            {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
          </h1>
          {column.tasks.map((task) => (
            <TaskCard
            task={task}
            updateTask={updateTask}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
)
}

export default App

