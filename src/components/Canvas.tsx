

import { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { createDrawingEngine } from "../typescript/engine/drawingEngine"
import Toolbar from "./Toolbar"

// instructions to what to do with my ui

// i need a button to make the toolbar desapper, and another button to make it appear again

// after all that i will add a fill bucket tool, i can look at some git hub repos that has a flash app in javascript and see how they handle the fill option

// i Had a great idea, i can make this type of hover box on the color pallete as well

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