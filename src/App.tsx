import Canvas from "./components/Canvas"
import Toolbar from "./components/Toolbar"
import CanvasTest from "./components/CanvasTest"

function App() {

  return (
    <div className="h-screen w-scre overflow-hidden relative">
      <Toolbar/>
      <Canvas/>
      {/* <CanvasTest/> */}
    </div>
  )
}

export default App
