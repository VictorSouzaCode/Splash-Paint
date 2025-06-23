import Canvas from "./components/Canvas"
import Toolbar from "./components/Toolbar"

function App() {

  return (
    <div className="h-screen w-scre overflow-hidden relative">
      <Toolbar/>
      <Canvas/>
    </div>
  )
}

export default App
