import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { getEngine } from "../utils/drawingEgineSingleton"


type UseEffectProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export const useCanvasEvents = ({
    canvasRef,
}:UseEffectProps) => {

    const [isDrawing, setIsDrawing] = useState<boolean>(false)

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
        e.preventDefault()
        setIsDrawing(true)
        
        if(e.button === 2) {
          undoDrawnShapesOnRightClick(e)
        }

        // prevents erasing the stroke on right click or drawing a a stroke when using the fill tool
        if (e.button === 2 || state.tool === 'fill') return;

        const point = { x: e.clientX, y: e.clientY }

        engine.startStroke(point, state)

      }

      const handleMouseUp = async () => {
        setIsDrawing(false)
        if(state.tool === 'fill') return;
        await engine.endStroke(state)

      }

      const handleMouseLeave = async () => {
        await engine.endStroke(state)
      }

      const handleFillClick = async (e:MouseEvent) => {
        e.preventDefault()
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

      const undoDrawnShapesOnRightClick = async (e:MouseEvent) => {

        if(isDrawing) return;

        if(e.button === 2 && state.tool == 'shape') {

          await engine.undo()
        }
      }

      const handleContextMenu = async (e:MouseEvent) => {
        e.preventDefault()
        await engine.cancelShapeStroke()
      }

      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
      canvas.addEventListener('click', handleFillClick)
      window.addEventListener('keydown', undoRedoShortCut)
      window.addEventListener('contextmenu', handleContextMenu)

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mouseup', handleMouseUp)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
        canvas.removeEventListener('click', handleFillClick)
        canvas.removeEventListener('click', undoDrawnShapesOnRightClick)
        window.removeEventListener('keydown', undoRedoShortCut)
        window.removeEventListener('contextmenu', handleContextMenu)
      }
  },[state, canvasRef, isDrawing])
}