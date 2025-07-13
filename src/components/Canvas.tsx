

import { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { resetCanvas } from "../redux/slices/undoRedo"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { useUndoRedo } from "../hooks/useUndoRedo"
import { createDrawingEngine } from "../typescript/engine/drawingEngine"


const Canvas = () => {
  const state = useSelector((state: RootState) => state.tools)
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement |  null>(null)

  const [engine, setEngine] = useState<ReturnType<typeof createDrawingEngine> | null>(null)

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

  useUndoRedo({
    canvasRef
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    if(!canvas) { return }
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

  },[resetCanvas])


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
    <MouseFollower/>
    </>
  )
}

export default Canvas