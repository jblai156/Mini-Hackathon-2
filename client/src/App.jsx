import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard from './components/task-card'

const fetcher = url => axios.get(url).then(res => res.data);

function App() {

  return (
    <>
    {tasks.map((task) => <TaskCard task={task} />)}
</>
  )
}

export default App
