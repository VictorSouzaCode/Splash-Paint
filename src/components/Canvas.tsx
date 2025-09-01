

import { useRef, useEffect, useState, } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { createDrawingEngine } from "../typescript/engine/drawingEngine"
import Toolbar from "./Toolbar"
import { setEngine } from "../utils/drawingEgineSingleton"
import ToolConfigurationBar from "./configurationBar/ToolConfigurationBar"


const Canvas = () => {
  const state = useSelector((state: RootState) => state.tools)
  const canvasBgRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement | null>(null)
  const [engineReady, setEngineReady] = useState<boolean>(false)

  useEffect(() => {
    if(canvasRef.current && canvasPreviewRef.current) {
      const engine = createDrawingEngine(canvasRef.current, canvasPreviewRef.current)
      setEngine(engine)
      setEngineReady(true)
    }
    console.log(engineReady)
  },[canvasRef.current, state])

  useResizeCanvas(
    canvasBgRef,
    canvasRef, 
    canvasPreviewRef,
  )

  useCanvasEvents({
    canvasRef,
  })

  // if(!engineReady) return null; // or a loading spinner

  return (
    <div className="relative w-full h-full">
      {/* Background layer*/}
      <canvas
        ref={canvasBgRef}
        className="absolute top-0 left-0 z-0"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0" />
      <canvas
        ref={canvasPreviewRef}
        className="absolute top-0 left-0 z-0 pointer-events-none bg-transparent"
      />

      {engineReady && (

        <div>
          <Toolbar />
          <ToolConfigurationBar />
        </div>
      )
      }

      <MouseFollower />
    </div>
  )
}

export default Canvas