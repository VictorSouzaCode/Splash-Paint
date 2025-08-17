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

      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      let engine;
      try {
        engine = getEngine();
      } catch (err) {
        console.warn("Drawing engine not ready:", err);
        return;
      }

      const handleMouseMove = (e: MouseEvent) => {
        const point = { x: e.clientX, y: e.clientY }

        if(state.tool === 'fill') return;
        
        engine.updateStroke(point, state)
      }

      const handleMouseDown = async (e: MouseEvent) => {
        if (e.button === 2 || state.tool === 'fill') return;

        const point = { x: e.clientX, y: e.clientY }

        engine.startStroke(point, state)


      }

      const handleMouseUp = async () => {
        if(state.tool === 'fill') return;
        await engine.endStroke(state)

      }

      const handleMouseLeave = async () => {
        await engine.endStroke(state)
      }

      const handleFillClick = async (e:MouseEvent) => {
        const startX = e.clientX
        const startY = e.clientY

        if(!ctx || e.button === 2 || state.tool !== 'fill') return;

        engine.fillAt(startX, startY, state)
      }

      const undoRedoShortCut = async (e:KeyboardEvent) => {

        const ctrlKey = e.ctrlKey;

        if(ctrlKey && e.key === 'z') {
          await engine.undo()
        }
        if(ctrlKey && e.key === 'x') {
          await engine.redo()
        }

      }

      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
      canvas.addEventListener('click', handleFillClick)
      window.addEventListener('keydown', undoRedoShortCut)

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mouseup', handleMouseUp)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
        canvas.removeEventListener('click', handleFillClick)
        window.removeEventListener('keydown', undoRedoShortCut)
      }
  },[state, canvasRef])
}