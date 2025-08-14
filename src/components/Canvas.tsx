

import { useRef, useEffect, useState, } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { createDrawingEngine } from "../typescript/engine/drawingEngine"
import Toolbar from "./Toolbar"
import { setEngine } from "../utils/drawingEgineSingleton"



// Change of plans for now
// For now i will make a rework on the ui

// What i want is

// when i select a tool, a button will be constantlly appearing on top of it, when i click in this button a painel with options for the tool selected will appear
// Make this painel a reusable component for other parts of the code
// make color pallete reusable
// make circle form reuasable

// i will not have a padding in the tool bar, the padding will be the background of the icon selected, reduzing its overal height and potentially increasing the icon size

// i need a color Schema for the background of the selected tools

// i need a size pattern for the icons box

// i will start the rework of the ui, cleaning the tailwind files

const Canvas = () => {
  const state = useSelector((state: RootState) => state.tools)
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement |  null>(null)
  const [engineReady, setEngineReady] = useState<boolean>(false)

  useEffect(() => {
    if(canvasRef.current && canvasPreviewRef.current) {
      const engine = createDrawingEngine(canvasRef.current, canvasPreviewRef.current)
      setEngine(engine)
      setEngineReady(true)
    }
  },[canvasRef.current, state])

  useResizeCanvas(
    canvasRef, 
    canvasPreviewRef
  )

  useCanvasEvents({
    canvasRef,
  })

  // if(!engineReady) return null; // or a loading spinner

  return (
    <>
    <canvas 
    ref={canvasRef}
    className="absolute top-0 left-0 z-0"
    style={{
      backgroundColor: state.screenColor,
    }}/>
    <canvas
    ref={canvasPreviewRef}
    className="absolute top-0 left-0 z-0 pointer-events-none bg-transparent"
    />
    {engineReady &&
    <Toolbar />
    }

    <MouseFollower/>
    </>
  )
}

export default Canvas