


import { useRef, useEffect, useState } from "react"
import { setDrawing } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import draw from "../typescript/draw"
import drawCircleOnClick from "../typescript/drawCircleOnClick"
import drawSquare from "../typescript/drawSquare"
import drawUndoRedo from "../typescript/drawUndoRedo"
import { usePointerFollower } from "../hooks/usePointerFollower"
import { saveStroke } from "../redux/slices/undoRedo"
import { current } from "@reduxjs/toolkit"


// Now i need to work on the undo/redo functionality
// i really dont know where i am going to start doing this
// i think i will ask chat gpt for guidance
// question: in a canvas project where i use react for the ui and typescript for the drawing logic How i can make a undo/redo function

// Use Redux to store strokes after the user finishes a stroke, not during it.
// After mouseup, dispatch stroke to Redux
// Only redraw the canvas from history when Redux state.history changes (with useEffect).


// all right, for i can see here i am using two mechanism to draw when adding a redo/undo functionality

// i draw a line or whatever on the canvas using the normal method, then i finish the stroke i store it in the redux store.

// now to make that drawing appear i need to listening to history changes on redux so here is the chat gpt explanation

// Yes, the useEffect([history]) does run every time a stroke is finished (i.e., added to Redux), but that’s exactly what we want — it redraws the entire canvas from scratch using the full history, preserving all previous strokes.

/*
You do draw during mousemove, but only for the current stroke (using useRef, not Redux). This provides real-time feedback and smooth drawing.

But that drawing is not persisted unless:

You dispatch it on mouseup.

You redraw it from Redux’s history later.

So you're using two drawing mechanisms: 
*/

/* 
The useEffect clears & redraws canvas from history.

✅ It keeps all strokes visible across redraws.

✅ No stroke disappears unless:

Redux is misconfigured,

Or the drawing logic has a bug (like forgetting to draw in useEffect).
*/

// i think it does it this way because of performance and to make undo/redo possible
// using one for smooth visual feedback, and then re-drawing using the history so i can undo it later

const CanvasTest = () => {
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.tools)
  const history = useSelector((state: RootState) => state.undoRedo.history)
  // use ref to not cause re-renders when drawing
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const [prevPos, setPrevPos] = useState<{x: number, y: number} | null>(null)
  const currentPos = useRef<{x: number, y: number}[]>([])
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

        const point = {x: e.clientX, y: e.clientY};
        currentPos.current.push(point)

        if(prevPos && state.toolForm === 'circle') {
          draw(ctx, state, prevPos.x, prevPos.y, e.clientX, e.clientY)
        }
        if(prevPos && state.toolForm === 'square') {
          drawSquare(ctx, state, e.clientX, e.clientY)
        }

      }
      setPrevPos({x: e.clientX, y: e.clientY})
      // Save the current position as prevPos for the next draw step.
    }

    const handleMouseDown = (e:MouseEvent) => {
      dispatch(setDrawing(true))

      currentPos.current = [{x: e.clientX, y: e.clientY}]

      if(state.toolForm === 'circle') {
        drawCircleOnClick(ctx, state, e.clientX, e.clientY)
      }

      if(state.toolForm === 'square') {
        drawSquare(ctx, state, e.clientX, e.clientY)
      }

      if(state.isDrawing) {

        setPrevPos({x: state.pointer.x, y: state.pointer.y})
        // Initializes prevPos so i know where to start the line.
      }
    }

    const handleMouseUp = () => {
      dispatch(setDrawing(false))
      dispatch(saveStroke({
        tool: state.tool,
        toolForm: state.toolForm,
        pencilColor: state.pencilColor,
        borderColor: state.borderColor,
        screenColor: state.screenColor,
        isDrawing: state.isDrawing,
        size: state.size,
        pointer: {
          x: state.pointer.x,
          y: state.pointer.y
        },
        storedStrokes: [...currentPos.current] // A continuous path that the user drew from mouse down to mouse up. // When redrawing the canvas, i use this array to “retrace” the path.
      }))
      currentPos.current = []
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

  useEffect(() => {
    const canvas = canvasRef.current!;
    if(!canvas) { return }
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    history.forEach((stroke) => {
      drawUndoRedo(ctx, stroke, stroke.storedStrokes)
    })
    
  },[history])

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

export default CanvasTest