import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const fetcher = url => axios.get(url).then(res => res.data);

function App() {
  const title = 'Kanban Collaboration Board'
  const id = "BUS-1"
  const points =5
  return (
    <div className="border rounded px-2 m-2 bg-base text-black">
    <div className="display-1 fw-semibold">
      {title}
    </div>
    <div className="display-3 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal">
      <div>{id}</div>
      <div>{points}</div>
    </div>
    </div>
  )
}

export default App
