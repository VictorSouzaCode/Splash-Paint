

import { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { createDrawingEngine } from "../typescript/engine/drawingEngine"
import Toolbar from "./Toolbar"


const Canvas = () => {
  const state = useSelector((state: RootState) => state.tools)
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement |  null>(null)

  const [engine, setEngine] = useState<ReturnType<typeof createDrawingEngine> | null>(null)

  const download = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "drawing.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  useEffect(() => {
    if(canvasRef.current) {
      const drawingEngine = createDrawingEngine(canvasRef.current, canvasPreviewRef.current)
      setEngine(drawingEngine)
    }
  },[canvasRef, state])

  useResizeCanvas(
    canvasRef, 
    canvasPreviewRef
  )

  useCanvasEvents({
    canvasRef,
    drawingEngine: engine
  })


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
    <Toolbar drawingEngine={engine} download={download} />
    <MouseFollower/>
    </>
  )
}

export default Canvas