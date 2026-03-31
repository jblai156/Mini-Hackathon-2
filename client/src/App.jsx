import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard, { tasks, statuses } from './components/task-card'

function App() {
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
  return (
  <div className="container-fluid mt-4">
    <div className="row">
      {columns.map((column) => (
        <div className="col-md-3 border-end">
          <h1 className="text-center mb-3 text-capitalize fw-bold text-secondary-emphasis">{column.title}</h1>
          {column.tasks.map((task) => <TaskCard task={task} />)}
        </div>
      ))}
    </div>
  </div>
)
}

export default App

