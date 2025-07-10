import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { createDrawingEngine } from "../typescript/drawingEngine"
import type { RootState } from "../redux/store"
import useCanvasEvents from "../hooks/useCanvasEvents"
import useUndoRedo from "../hooks/useUndoRedo"
import MouseFollower from "./MouseFollower"

const Canvas = () => {
  const state = useSelector((state: RootState) => state.tools)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement | null>(null)
  const [engine, setEngine] = useState<ReturnType<typeof createDrawingEngine> | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const drawingEngine = createDrawingEngine(canvasRef.current)
      setEngine(drawingEngine)
    }
  }, [canvasRef, state])

  useCanvasEvents({
    canvasRef,
    canvasPreviewRef,
    drawingEngine: engine,
  })

  useUndoRedo({
    engine
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute top-0 left-0 z-0"
        style={{ backgroundColor: state.screenColor }}
      />
      <canvas
        ref={canvasPreviewRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute top-0 left-0 z-0 pointer-events-none bg-transparent"
      />
      <MouseFollower />
    </>
  )
}

export default Canvas