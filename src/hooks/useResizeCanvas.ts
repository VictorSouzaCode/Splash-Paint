import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";


export const useResizeCanvas = (
  bgRef: React.RefObject<HTMLCanvasElement | null>,
  drawRef: React.RefObject<HTMLCanvasElement | null>,
  previewRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const state = useSelector((s: RootState) => s.tools);

  // save strokes temporarily
  const savedDrawing = useRef<ImageData | null>(null);

  useEffect(() => {
    const bgCanvas = bgRef.current;
    const drawCanvas = drawRef.current;
    const previewCanvas = previewRef.current;

    if (!bgCanvas || !drawCanvas) return;

    const resizeAll = () => {
      // ---- Save strokes before resizing ----
      if (drawCanvas.width && drawCanvas.height) {
        const ctx = drawCanvas.getContext("2d");
        if (ctx) {
          savedDrawing.current = ctx.getImageData(
            0,
            0,
            drawCanvas.width,
            drawCanvas.height
          );
        }
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      // ---- Background canvas ----
      if (bgCanvas) {
        const bgCtx = bgCanvas.getContext("2d");
        if (bgCtx) {
          // Save old canvas
          const oldCanvas = document.createElement("canvas");
          oldCanvas.width = bgCanvas.width;
          oldCanvas.height = bgCanvas.height;
          oldCanvas.getContext("2d")?.drawImage(bgCanvas, 0, 0);

          // Resize
          bgCanvas.width = w;
          bgCanvas.height = h;

          // Draw old content scaled
          bgCtx.drawImage(oldCanvas, 0, 0, w, h);

          // Fill missing areas if needed
          bgCtx.fillStyle = state.screenColor;
          bgCtx.fillRect(0, 0, w, h);
        }
      }

      // ---- Drawing canvas ----
      drawCanvas.width = w;
      drawCanvas.height = h;
      const dctx = drawCanvas.getContext("2d");
      if (dctx && savedDrawing.current) {
        dctx.putImageData(savedDrawing.current, 0, 0);
      }

      // ---- Preview canvas ----
      if (previewCanvas) {
        previewCanvas.width = w;
        previewCanvas.height = h;
      }
    };

    resizeAll();
    window.addEventListener("resize", resizeAll);
    return () => window.removeEventListener("resize", resizeAll);
  }, [state.screenColor, bgRef, drawRef, previewRef]);
};