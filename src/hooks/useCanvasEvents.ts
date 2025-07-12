import { useEffect } from "react"
import { setDrawing } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"


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
    if(!canvas || !drawingEngine) { return }
    const ctx = canvas.getContext('2d')!

    const handleMouseMove = (e:MouseEvent) => {
      const point = { x: e.clientX, y: e.clientY }
      drawingEngine.updateStroke(point, state)
    }

    const handleMouseDown = async (e:MouseEvent) => {
      if(e.button === 2) return;

      const point = {x: e.clientX, y: e.clientY}

      drawingEngine?.startStroke(point, state)

    }

    const handleMouseUp = async () => {

      await drawingEngine?.endStroke(state)

      // dispatch(setDrawing(false))
      
      /* const canvasPreview = canvasPreviewRef.current!

      const ctxPreview = canvasPreviewRef.current?.getContext('2d')

      if (!ctxPreview) return;

      ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height) */
    }

    const handleMouseLeave = async () => {
      dispatch(setDrawing(false))
      // await drawingEngine?.endStroke()
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
  },[state, drawingEngine])
}