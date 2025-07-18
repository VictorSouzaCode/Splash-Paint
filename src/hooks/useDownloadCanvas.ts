import { useCallback } from "react";

type ImageFormat = "png" | "jpeg";

export const useDownloadCanvas = () => {
  const downloadCanvas = useCallback(
    (
      canvas: HTMLCanvasElement | null,
      format: ImageFormat = "png",
      fileName = "canvas-image",
      backgroundColor?: string // Add optional background color
    ) => {
      if (!canvas) {
        console.warn("No canvas element provided");
        return;
      }

      // Create a temporary canvas to draw background + original content
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Draw background color if specified
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      }

      // Draw the original canvas content over the background
      ctx.drawImage(canvas, 0, 0);

      // Get data URL
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const dataURL = tempCanvas.toDataURL(mimeType);

      // Create and click a temporary download link
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );

  return { downloadCanvas };
};