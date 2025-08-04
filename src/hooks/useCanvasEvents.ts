import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { getEngine } from "../utils/drawingEgineSingleton"


type UseEffectProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export const useCanvasEvents = ({
    canvasRef,
}:UseEffectProps) => {

    const state = useSelector((state: RootState) => state.tools)

    useEffect(() => {


      const canvas = canvasRef.current!;
      if (!canvas) { return }

      let engine;
      try {
        engine = getEngine();
      } catch (err) {
        console.warn("Drawing engine not ready:", err);
        return;
      }

      const handleMouseMove = (e: MouseEvent) => {
        const point = { x: e.clientX, y: e.clientY }
        
        engine.updateStroke(point, state)
      }

      const handleMouseDown = async (e: MouseEvent) => {
        if (e.button === 2) return;

        const point = { x: e.clientX, y: e.clientY }

        engine.startStroke(point, state)


      }

      const handleMouseUp = async () => {
        await engine.endStroke(state)

      }

      const handleMouseLeave = async () => {
        await engine.endStroke(state)
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
  },[state, canvasRef])
}