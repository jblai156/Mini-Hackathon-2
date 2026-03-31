import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const fetcher = url => axios.get(url).then(res => res.data);

function App() {
  return (
    <div className="display-1 text-info">
      Hello
    </div>
  )
}

export default App
