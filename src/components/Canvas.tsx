
// This component is responsible for:

// Managing canvas drawing behavior

// Listening to mouse events

// Triggering draw actions

import { useRef, useEffect, useState } from "react"
import { setDrawing } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import draw from "../typescript/draw"
import drawCircleOnClick from "../typescript/drawCircleOnClick"
import { usePointerFollower } from "../hooks/usePointerFollower"


// Now i need to add square pencil
// first step i think is to add a button to the toolbar that change the circle pencil to a square pencil
// second is make a draw file that draws a square and there add all the functions that the circle has type of color if it is a eraser or pencil etc
// then i need to adapt the function that draws the circle here in canvas to include the square pencil when it is selected
// then i need to change the circle that follows the mouse to a square, there are a lot of ways i can do that, i can simply change rounded to none or i can make a saparate div

//i think that i can start changing the mouse follower format when i click on a button
// then i working in the draw logic


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

      if(state.isDrawing) {
        if(prevPos && state.toolForm === 'circle') {
          draw(ctx, state, prevPos.x, prevPos.y, e.clientX, e.clientY)
        }
      }
      setPrevPos({x: e.clientX, y: e.clientY})
      // Save the current position as prevPos for the next draw step.
    }

    const handleMouseDown = (e:MouseEvent) => {
      dispatch(setDrawing(true))

      if(state.toolForm === 'circle') {
        drawCircleOnClick(ctx, state, e.clientX, e.clientY)
      }

      if(state.toolForm === 'square') {
        console.log('square drawn') // PUT SQUARE DRAWING LOGIC HERE
      }

      if(state.isDrawing && state.toolForm === 'circle') {

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
    canvas.addEventListener('mouseleave', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseUp)
    }
  },[state, prevPos])

  const { followerRef } = usePointerFollower()


  return (
    <>
    <canvas 
    ref={canvasRef}
    className="absolute top-0 left-0 z-0"
    style={{
      backgroundColor: state.screenColor,
    }}/>
    <div
    ref={followerRef}
    className="absolute pointer-events-none z-0"
    style={{
      borderRadius: state.toolForm === 'circle' ? '50%' : '0%',
      width: state.size,
      height: state.size,
      borderWidth: state.tool === 'eraser' ? '2px' : '1px',
      borderStyle: 'solid',
      borderColor: state.tool === 'eraser' ? 'black' : state.pencilColor,
      willChange: 'transform',
    }}
    />
    </>
  )
}

export default Canvas