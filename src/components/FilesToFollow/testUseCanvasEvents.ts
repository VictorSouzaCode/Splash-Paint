import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import type { Point } from "../FilesToFollow/testdrawingEngine"

type UseCanvasEventsProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    canvasPreviewRef: React.RefObject<HTMLCanvasElement | null>,
    drawingEngine: ReturnType<typeof import("../FilesToFollow/testdrawingEngine").createDrawingEngine> | null,
}

const useCanvasEvents = ({ 
    canvasRef, 
    canvasPreviewRef, 
    drawingEngine 
}: UseCanvasEventsProps) => {

  const toolState = useSelector((state: RootState) => state.tools)
  
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !drawingEngine) return

        const handleMouseDown = (e: MouseEvent) => {
            const point: Point = { x: e.offsetX, y: e.offsetY }
            drawingEngine.startStroke(point, toolState)
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!drawingEngine) return
            if (e.buttons !== 1) return // Only draw while mouse button is pressed

            const point: Point = { x: e.offsetX, y: e.offsetY }
            drawingEngine.updateStroke(point)
        }

        const handleMouseUp = async (e: MouseEvent) => {
            await drawingEngine.endStroke()
        }

        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)
        }
    }, [drawingEngine])
}

export default useCanvasEvents