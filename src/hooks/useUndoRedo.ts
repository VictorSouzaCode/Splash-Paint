import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import drawUndoRedo from "../typescript/drawUndoRedo"
import { redrawCircleOnClick } from "../typescript/drawUndoRedo"
import { redrawStraightLine } from "../typescript/drawUndoRedo"
import { useEffect } from "react"

type UndoRedoProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

// re-drawing the canvas on mouse realase for undo/redo function
export const useUndoRedo = ({canvasRef}:UndoRedoProps) => {

    const history = useSelector((state: RootState) => state.undoRedo.history)

    useEffect(() => {
      const canvas = canvasRef.current!;
      if (!canvas) { return }
      const ctx = canvas.getContext('2d')!

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      history.forEach((stroke) => {
        drawUndoRedo(ctx, stroke, stroke.storedStrokes)
        redrawCircleOnClick(ctx, stroke, stroke.storedStrokes)
        redrawStraightLine(ctx, stroke, stroke.storedStrokes)
      })
    },[])
}