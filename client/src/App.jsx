import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard from './task-card'

const fetcher = url => axios.get(url).then(res => res.data);

function App() {
  const title = 'Kanban Collaboration Board'
  const id = "BUS-1"
  const points =5

  return (
    <>
    <TaskCard title={title} id={id} point={points} />
    <TaskCard title='Competitor analysis' id='BUS-2' points={3}/>
    <TaskCard title='Develop Business Strategy' id='BUS-3' points={8}/>
    <TaskCard title='Develop Marketing Strategy' id='BUS-4' points={5}/>

</>
  )
}

export default App

