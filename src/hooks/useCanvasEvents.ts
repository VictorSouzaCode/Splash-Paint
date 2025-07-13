import { useEffect } from "react"
import { setDrawing } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"


type UseEffectProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    drawingEngine: ReturnType<typeof import("../typescript/engine/drawingEngine").createDrawingEngine> | null,
}

export const useCanvasEvents = ({
    canvasRef,
    drawingEngine,
}:UseEffectProps) => {

    const dispatch = useDispatch()
    const state = useSelector((state: RootState) => state.tools)

    useEffect(() => {
      const canvas = canvasRef.current!;
      if (!canvas || !drawingEngine) { return }

      const handleMouseMove = (e: MouseEvent) => {
        const point = { x: e.clientX, y: e.clientY }
        
        drawingEngine.updateStroke(point, state)
      }

      const handleMouseDown = async (e: MouseEvent) => {
        if (e.button === 2) return;

        const point = { x: e.clientX, y: e.clientY }

        drawingEngine.startStroke(point, state)

      }

      const handleMouseUp = async () => {
        await drawingEngine.endStroke(state)

      }

      const handleMouseLeave = async () => {
        await drawingEngine.endStroke(state)
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