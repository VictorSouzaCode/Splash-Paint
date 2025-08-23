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
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        // save old content
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        const imageData = ctx.getImageData(0, 0, oldWidth, oldHeight);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.fillStyle = state.screenColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // restore content
        ctx.putImageData(imageData, 0, 0);
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