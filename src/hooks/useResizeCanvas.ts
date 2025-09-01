import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";


type CanvasPropRef = React.RefObject<HTMLCanvasElement | null>

type CanvasPropRef2 = React.RefObject<HTMLCanvasElement | null>

export const useResizeCanvas = (
  canvasProp: CanvasPropRef, 
  canvasProp2: CanvasPropRef2,
  onReady?: () => void
) => {

  const state = useSelector((state: RootState) => state.tools)

  useLayoutEffect(() => {
    const canvas = canvasProp.current;
    const canvasPreview = canvasProp2.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Save old content
      const oldW = canvas.width || 0;
      const oldH = canvas.height || 0;

      const offscreen = document.createElement("canvas");
      offscreen.width = oldW;
      offscreen.height = oldH;
      const offCtx = offscreen.getContext("2d");
      if (offCtx) offCtx.drawImage(canvas, 0, 0);

      // Resize both canvases to viewport
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      canvas.width = newW;
      canvas.height = newH;

      // Fill background first
      ctx.fillStyle = state.screenColor;
      ctx.fillRect(0, 0, newW, newH);

      // Restore old content (scaled to new size)
      if (oldW && oldH && offCtx) {
        ctx.drawImage(offscreen, 0, 0, oldW, oldH, 0, 0, newW, newH);
      }

      if (canvasPreview) {
        canvasPreview.width = newW;
        canvasPreview.height = newH;
        const pctx = canvasPreview.getContext("2d");
        if (pctx) {
          // ensure preview is fully cleared
          pctx.clearRect(0, 0, newW, newH);
        }
      }

      onReady?.();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  },[state.screenColor, onReady])
}