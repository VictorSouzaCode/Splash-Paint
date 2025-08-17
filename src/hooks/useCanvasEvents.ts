import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { getEngine } from "../utils/drawingEgineSingleton"


type UseEffectProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

// Next step is to add control + z keyboard command to my app
// after that is make a good read.me file
// after that is make contributions guidelines
// after that is deploy it online
// deal with all trouble that can or can not happen
// after that is make a linkedin post about it
// after that is make a linkedin project section about it
// after that is make a twitter post about it
// after that i might or might not write something about it on the dev.io, because there i want to comment like a normal human being on stuff

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