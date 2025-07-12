

import { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { resetCanvas } from "../redux/slices/undoRedo"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { useUndoRedo } from "../hooks/useUndoRedo"
import { usePreviewDrawing } from "../hooks/usePreviewDrawing"
import { createDrawingEngine } from "../typescript/engine/drawingEngine"


const Canvas = () => {
  const state = useSelector((state: RootState) => state.tools)
  // use ref to not cause re-renders when drawing
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement |  null>(null)
  const [prevPos, setPrevPos] = useState<{x: number, y: number} | null>(null) // holds the previous mouse position so i can draw a line segment from that point to the current point. Without this, fast mouse movements result in disconnected circles.
  const currentPosition = useRef<{x: number, y:number}[]>([])

  // useState to draw lines
  const [lineStartPoint, setLineStartPoint] = useState<{x:number, y:number}| null>(null)
  const [mousePosLine, setMousePosLine] = useState<{x:number, y:number}| null>(null)

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
    canvasPreviewRef,
    prevPos,
    currentPosition,
    lineStartPoint,
    drawingEngine: engine,
    setPrevPos,
    setLineStartPoint,
    setMousePosLine,
  })

  useUndoRedo({
    canvasRef
  })

  usePreviewDrawing({
    canvasPreviewRef, 
    mousePosLine, 
    lineStartPoint
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