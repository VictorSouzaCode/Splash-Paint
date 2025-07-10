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
import type { Point } from "../typescript/engine/drawingEngine"


type UseEffectProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    canvasPreviewRef: React.RefObject<HTMLCanvasElement | null>,
    prevPos: {x: number, y: number} | null,
    currentPosition: React.RefObject<{x: number, y: number;}[]>,
    lineStartPoint: {x: number, y: number} | null,
    drawingEngine: ReturnType<typeof import("../typescript/engine/drawingEngine").createDrawingEngine> | null,
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
    drawingEngine,
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

      if(!drawingEngine) return;

      const point = { x: e.clientX, y: e.clientY }
      drawingEngine.updateStroke(point)
      
      setPrevPos({x: e.clientX, y: e.clientY})
      // Save the current position as prevPos for the next draw step with the rouded pencil.
    }

    const handleMouseDown = async (e:MouseEvent) => {
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

      if(state.toolForm === 'circle' || state.toolForm === 'square') {
        drawingEngine?.startStroke(point, state)
      }
    }

    const clearPreviewCanvasOnMouseUp = () => {
      const canvasPreview = canvasPreviewRef.current!

      const ctxPreview = canvasPreviewRef.current?.getContext('2d')

      if (!ctxPreview) return;

      ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)
    }

    const handleMouseUp = async (e:MouseEvent) => {
      
      // dispatch(setDrawing(false))

      const point = {x: e.clientX, y: e.clientY}

      await drawingEngine?.endStroke()

      /* if(state.toolForm === 'circle' || state.toolForm === 'square'){
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
      } */

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
  },[state, prevPos, drawingEngine])
}