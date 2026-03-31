import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard, { tasks, statuses } from './components/task-card'

function App() {

  const todoTasks = tasks.filter((task) => task.status === 'todo')
  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress')
  const doneTasks = tasks.filter((task) => task.status === 'done')

  return (
    <div className="flex container mt-4">
      <div className="row g-3">
        <div className="col-md-4">
            <h1>To do</h1>
            {todoTasks.map((task) => <TaskCard task={task} />)}
            </div>
        <div className="col-md-4">
          <h1>In Progress</h1>
          {inProgressTasks.map((task) => <TaskCard task={task} />)}
        </div>
        <div className="col-md-4">
          <h1>Done</h1>
          {doneTasks.map((task) => <TaskCard task={task} />)}
        </div>
      </div>
    </div>
  )
}

export default App

