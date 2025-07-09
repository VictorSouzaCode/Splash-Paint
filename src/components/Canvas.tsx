

import { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { resetCanvas } from "../redux/slices/undoRedo"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import { useCanvasEvents } from "../hooks/useCanvasEvents"
import { useUndoRedo } from "../hooks/useUndoRedo"
import { usePreviewDrawing } from "../hooks/usePreviewDrawing"


// refactor is the process of turning my dirty code into clean code
// Things to Keep in mind when refactoring
// easy to read, clear and consistent naming
// This code needs to be ease to understand
// this code needs to be able to be changed

// useState in react, aways when i have a useState i need to ask myself does this state needs to be here or it can be moved somewhere else, somewhere else being the parent or further down so the main component doesnt re-render when this state changes

// i can put a div in a sigle component to follow the single responsability principal that is a design pattern in react, which means i can have a component the handles a single div and have it encapsulated away from this main component

// use customHooks if i have code that i use in other places

// the fact that i needed to change something is a good indicator that i will need to change that in the future, so i make it easy to make those changes, and then i applied the change

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