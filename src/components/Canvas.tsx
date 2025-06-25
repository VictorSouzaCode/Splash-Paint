
// This component is responsible for:

// Managing canvas drawing behavior

// Listening to mouse events

// Triggering draw actions

// Displaying a brush indicator (a circle following the mouse)

import { useRef, useEffect, useState } from "react"
import { setPointerPosition, setDrawing } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import draw from "../typescript/draw"
import drawCircleOnClick from "../typescript/drawCircleOnClick"

const Canvas = () => {
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.tools)

  // use ref to not cause re-renders when drawing
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const [prevPos, setPrevPos] = useState<{x: number, y: number} | null>(null)
  // holds the previous mouse position so i can draw a line segment from that point to the current point. Without this, fast mouse movements result in disconnected circles.

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) { return }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  },[])

  useEffect(() => {
    const canvas = canvasRef.current!;
    if(!canvas) { return }
    const ctx = canvas.getContext('2d')!

    const handleMouseMove = (e:MouseEvent) => {
      dispatch(setPointerPosition({x: e.clientX, y: e.clientY}))
      if(state.isDrawing) {
        if(prevPos) {
          draw(ctx, state, prevPos.x, prevPos.y, e.clientX, e.clientY)
        }
      }
      setPrevPos({x: e.clientX, y: e.clientY})
      // Save the current position as prevPos for the next draw step.
    }

    const handleMouseDown = (e:MouseEvent) => {
      dispatch(setDrawing(true))

      drawCircleOnClick(ctx, state, e.clientX, e.clientY)

      if(state.isDrawing) {

        setPrevPos({x: state.pointer.x, y: state.pointer.y})
        // Initializes prevPos so i know where to start the line.
      }
    }

    const handleMouseUp = () => {
      dispatch(setDrawing(false))
      setPrevPos(null)
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  },[state, prevPos])

  return (
    <>
    <canvas 
    ref={canvasRef}
    className="absolute top-0 left-0 z-0"
    style={{
      backgroundColor: state.screenColor,
    }}/>

    <div 
    className="absolute rounded-full pointer-events-none z-0"
    
    style={{
      left: state.pointer.x - state.size / 2,
      top: state.pointer.y - state.size / 2,
      width: state.size,
      height: state.size,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: state.borderColor,
    }}/>
    </>
  )
}

export default Canvas