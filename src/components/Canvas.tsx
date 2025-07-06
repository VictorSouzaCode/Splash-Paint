
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
import drawSquare from "../typescript/drawSquare"
import { drawSquareShape, drawTriangleShape, drawCircleShape } from "../typescript/drawShapes"
import drawUndoRedo, {redrawCircleOnClick, redrawStraightLine} from "../typescript/drawUndoRedo"
import { drawStraightLine } from "../typescript/drawStraightLine"
import { saveStroke, resetCanvas } from "../redux/slices/undoRedo"
import MouseFollower from "./MouseFollower"
import { useResizeCanvas } from "../hooks/useResizeCanvas"

// Now before adding the final features for the release of this app, i want to refactor this code!
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
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.tools)
  const history = useSelector((state: RootState) => state.undoRedo.history)
  // use ref to not cause re-renders when drawing
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)
  const canvasPreviewRef = useRef<HTMLCanvasElement |  null>(null)
  const [prevPos, setPrevPos] = useState<{x: number, y: number} | null>(null) // holds the previous mouse position so i can draw a line segment from that point to the current point. Without this, fast mouse movements result in disconnected circles.
  const currentPosition = useRef<{x: number, y:number}[]>([])

  // useState to draw lines
  const [lineStartPoint, setLineStartPoint] = useState<{x:number, y:number}| null>(null)
  const [mousePosLine, setMousePosLine] = useState<{x:number, y:number}| null>(null)

  //useState to draw Shapes
  const [shapeStartPoint, setShapeStartPoint] = useState<{x:number, y:number} | null>(null)
  const [mousePosShape, setMousePosShape] = useState<{x:number, y:number} | null>(null)

  useResizeCanvas(canvasRef, canvasPreviewRef)


  useEffect(() => {
    const canvas = canvasRef.current!;
    if(!canvas) { return }
    const ctx = canvas.getContext('2d')!

    const handleMouseMove = (e:MouseEvent) => {
      setMousePosLine({x: e.clientX, y: e.clientY})
      setMousePosShape({x: e.clientX, y: e.clientY})

      if(state.isDrawing) {
        const point = {x: e.clientX, y: e.clientY}

        if(prevPos && state.toolForm === 'circle') {
          draw(ctx, state, prevPos.x, prevPos.y, e.clientX, e.clientY)
          currentPosition.current.push(point)
        }
        if(prevPos && state.toolForm === 'square') {
          drawSquare(ctx, state, e.clientX, e.clientY)
          currentPosition.current.push(point)
        }
      }
      setPrevPos({x: e.clientX, y: e.clientY})
      // Save the current position as prevPos for the next draw step with the rouded pencil.
    }

    const handleMouseDown = (e:MouseEvent) => {
      if(e.button === 2) return;

      const point = {x: e.clientX, y: e.clientY}

      dispatch(setDrawing(true))

      if(state.toolForm === 'line') {

        if(!lineStartPoint) {

          setLineStartPoint(point)

        } else {

          setLineStartPoint(null)
        }
        return
      }

      if(state.toolForm === 'square-shape'){
        if(!shapeStartPoint) {
          setShapeStartPoint(point)
        } else {

          drawSquareShape(ctx, state, shapeStartPoint, point)

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
            storedStrokes: [shapeStartPoint, point]
          }))

          setShapeStartPoint(null)
        }
        return
      }

      if(state.toolForm === 'triangle-shape'){

        if(!shapeStartPoint){
          setShapeStartPoint(point)

        } else {

          drawTriangleShape(ctx, state, shapeStartPoint, point)

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
            storedStrokes: [shapeStartPoint, point]
          }))

          setShapeStartPoint(null)
        }
        return
      }

      if(state.toolForm === 'circle-shape') {
        if(!shapeStartPoint){
          setShapeStartPoint(point)
        } else {
          drawCircleShape(ctx, state, shapeStartPoint, point)

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
            storedStrokes: [shapeStartPoint, point]
          }))
          setShapeStartPoint(null)
        }
        return
      }

      if(state.toolForm === 'circle') {
        drawCircleOnClick(ctx, state, e.clientX, e.clientY)
        currentPosition.current = [point]
      }

      if(state.toolForm === 'square') {
        drawSquare(ctx, state, e.clientX, e.clientY)
        currentPosition.current = [point]
      }

      if(state.isDrawing) {

        setPrevPos({x: state.pointer.x, y: state.pointer.y})
        // Initializes prevPos so i know where to start the line.
      }
    }

    const clearPreviewCanvasOnMouseUp = () => {
      const canvasPreview = canvasPreviewRef.current!

      const ctxPreview = canvasPreviewRef.current?.getContext('2d')

      if (!ctxPreview) return;

      ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)
    }

    const handleMouseUp = (e:MouseEvent) => {
      
      dispatch(setDrawing(false))

      if(state.toolForm !== "line" && state.toolForm !== "square-shape" && state.toolForm !== 'triangle-shape' && state.toolForm !== 'circle-shape'){
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
        storedStrokes: [...currentPosition.current]
      }))
      }

      if(state.toolForm === 'line' && lineStartPoint) {
        setLineStartPoint(null)

          const point = {x: e.clientX, y: e.clientY}

          drawStraightLine(ctx, state, lineStartPoint, point)

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
            storedStrokes: [lineStartPoint, point]
          }))
      }
      
      currentPosition.current = []
      clearPreviewCanvasOnMouseUp()
      setPrevPos(null)
    }

    const handleMouseLeave = () => {
      dispatch(setDrawing(false))
      setPrevPos(null)
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  },[state, prevPos])


  // re-drawing the canvas on mouse realase for undo/redo function
  useEffect(() => {
    const canvas = canvasRef.current!;
    if(!canvas) { return }
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    history.forEach((stroke) => {
      drawUndoRedo(ctx, stroke, stroke.storedStrokes)
      redrawCircleOnClick(ctx, stroke, stroke.storedStrokes)
      redrawStraightLine(ctx, stroke, stroke.storedStrokes)
    })
  },[history])


  // draw preview of lines
  useEffect(() => {

    const canvasPreview = canvasPreviewRef.current

    if(!canvasPreview || (!lineStartPoint && !shapeStartPoint) ) return;

    const ctxPreview = canvasPreview.getContext('2d')
    
    if (!ctxPreview) return;

    ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)

    if(state.toolForm === 'line' && lineStartPoint && mousePosLine) {
      drawStraightLine(ctxPreview, state, lineStartPoint, mousePosLine)
    }

    if (state.toolForm === "square-shape" && shapeStartPoint && mousePosShape) {
    drawSquareShape(ctxPreview, state, shapeStartPoint, mousePosShape)
    }

    if(state.toolForm === 'triangle-shape' && shapeStartPoint && mousePosShape){
      drawTriangleShape(ctxPreview, state, shapeStartPoint, mousePosShape)
    }

    if (state.toolForm === 'circle-shape' && shapeStartPoint && mousePosShape) {
      drawCircleShape(ctxPreview, state, shapeStartPoint, mousePosShape)
    }

  },[mousePosLine, lineStartPoint, mousePosShape, shapeStartPoint, state])



  // clear canvas on reset button
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