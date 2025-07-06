import { useEffect } from "react";

type CanvasPropRef = React.RefObject<HTMLCanvasElement | null>

type CanvasPropRef2 = React.RefObject<HTMLCanvasElement | null>

export const useResizeCanvas = (
  canvasProp: CanvasPropRef, 
  canvasProp2: CanvasPropRef2
) => {

    useEffect(() => {
    const canvas = canvasProp.current;
    const canvasPreview = canvasProp2.current;

    if(!canvas) { return }

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      if(canvasPreview) {
        canvasPreview.width = window.innerWidth;
        canvasPreview.height = window.innerHeight;
      }
    }
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  },[])
}