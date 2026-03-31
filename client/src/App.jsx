import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskCard from './component/task-card'

const fetcher = url => axios.get(url).then(res => res.data);

function App() {
  const task = {
    title: 'Do Market Research',
    id: 'BUS-1',
    points: 5
  }

  return (
    <>
    <TaskCard task={task} />

    {/* <TaskCard title={title} id={id} point={points} />
    <TaskCard title='Competitor analysis' id='BUS-2' points={3}/>
    <TaskCard title='Develop Business Strategy' id='BUS-3' points={8}/>
    <TaskCard title='Develop Marketing Strategy' id='BUS-4' points={5}/> */}
</>
  )
}

export default App

