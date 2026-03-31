import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard, { tasks } from './components/task-card'

function App() {

  return (
    <>
    {tasks.map((task) => <TaskCard task={task} />)}
</>
  )
}

export default App

