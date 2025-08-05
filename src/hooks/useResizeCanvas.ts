import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";


type CanvasPropRef = React.RefObject<HTMLCanvasElement | null>

type CanvasPropRef2 = React.RefObject<HTMLCanvasElement | null>

export const useResizeCanvas = (
  canvasProp: CanvasPropRef, 
  canvasProp2: CanvasPropRef2
) => {

  const state = useSelector((state: RootState) => state.tools)

    useEffect(() => {

    const canvas = canvasProp.current;
    const canvasPreview = canvasProp2.current;

    if(!canvas) { return }

    const resizeCanvas = () => {

      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        ctx.fillStyle = state.screenColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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