import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";


type CanvasPropRef = React.RefObject<HTMLCanvasElement | null>

type CanvasPropRef2 = React.RefObject<HTMLCanvasElement | null>

export const useResizeCanvas = (
  canvasProp: CanvasPropRef, 
  canvasProp2: CanvasPropRef2
) => {

  const state = useSelector((state: RootState) => state.tools)

  // keep a ref to the last saved image + dimensions
  const savedImage = useRef<{
    data: ImageData | null;
    width: number;
    height: number;
  }>({ data: null, width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasProp.current;
    const canvasPreview = canvasProp2.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // save current image BEFORE resizing
      if (canvas.width && canvas.height) {

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        savedImage.current = {
          data: imageData,
          width: canvas.width,
          height: canvas.height,
        };
      }

      // resize canvases
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = state.screenColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // restore image in original size (not stretched)
      if (savedImage.current.data) {
        const { data, width, height } = savedImage.current;

        // calculate center placement
        const offsetX = (canvas.width - width) / 2;
        const offsetY = (canvas.height - height) / 2;

        ctx.putImageData(data, offsetX, offsetY);
      }
      if (canvasPreview) {
        
        canvasPreview.width = window.innerWidth;
        canvasPreview.height = window.innerHeight;
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [state.screenColor]);
};