import './App.css'

const fetcher = url => axios.get(url).then(res => res.data);

function App() {
  return (
    <div>
      Hello
    </div>
  )
}

export default App
