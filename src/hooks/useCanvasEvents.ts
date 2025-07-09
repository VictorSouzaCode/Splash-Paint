import { useEffect } from "react"
import { setDrawing } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import draw from "../typescript/draw"
import drawCircleOnClick from "../typescript/drawCircleOnClick"
import drawSquare from "../typescript/drawSquare"
import { drawSquareShape, drawTriangleShape, drawCircleShape } from "../typescript/drawShapes"
import { drawStraightLine } from "../typescript/drawStraightLine"
import { saveStroke } from "../redux/slices/undoRedo"

// Now before breaking this code into smaller parts i want to make it simpler, take out states and functions that are not needed and try to simplify it as much as i can

// remember to add a function to cancel the shape that i am doing if i am not happy with with its position

// i really dont know where to start
// i think i will change my focus a little bit to refactor this code here then i will go back to work on the drawing engine
// so i will clean it a litte bit to better understand it and later add the drawing engine to it
// i think i can change the drawing to my second preview canvas instead of drawing directly into my normal canvas where the images will be stored


type UseEffectProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    canvasPreviewRef: React.RefObject<HTMLCanvasElement | null>,
    prevPos: {x: number, y: number} | null,
    currentPosition: React.RefObject<{x: number, y: number;}[]>,
    lineStartPoint: {x: number, y: number} | null,
    setPrevPos: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;} | null>>,
    setLineStartPoint: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;} | null>>,
    setMousePosLine: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;} | null>>,
}

export const useCanvasEvents = ({
    canvasRef,
    canvasPreviewRef,
    prevPos,
    currentPosition,
    lineStartPoint,
    setPrevPos,
    setLineStartPoint,
    setMousePosLine
}:UseEffectProps) => {

    const dispatch = useDispatch()
    const state = useSelector((state: RootState) => state.tools)

    useEffect(() => {
    const canvas = canvasRef.current!;
    if(!canvas) { return }
    const ctx = canvas.getContext('2d')!

    const handleMouseMove = (e:MouseEvent) => {
      setMousePosLine({x: e.clientX, y: e.clientY})

      if(state.isDrawing) {
        const point = {x: e.clientX, y: e.clientY}

        if(prevPos && state.toolForm === 'circle') {
          draw(ctx, state, prevPos, point)
          currentPosition.current.push(point)
        }
        if(prevPos && state.toolForm === 'square') {
          drawSquare(ctx, state, point)
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

      if(!lineStartPoint) {
        setLineStartPoint(point)

        if(state.toolForm === 'circle' || state.toolForm === 'square'){
        setLineStartPoint(null)
        }

      } else {

        setLineStartPoint(null)
      }

      if(state.toolForm === 'circle') {
        drawCircleOnClick(ctx, state, point)
        currentPosition.current = [point]
      }

      if(state.toolForm === 'square') {
        drawSquare(ctx, state, point)
        currentPosition.current = [point]
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

      const point = {x: e.clientX, y: e.clientY}

      if(state.toolForm === 'circle' || state.toolForm === 'square'){
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

      if(state.toolForm === 'square-shape' && lineStartPoint){

        drawSquareShape(ctx, state, lineStartPoint, point)

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

      if(state.toolForm === 'triangle-shape' && lineStartPoint){

        drawTriangleShape(ctx, state, lineStartPoint, point)

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

      if(state.toolForm === 'circle-shape' && lineStartPoint) {
          
          drawCircleShape(ctx, state, lineStartPoint, point)

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
      setLineStartPoint(null)
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
}