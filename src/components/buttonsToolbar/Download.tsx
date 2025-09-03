import { IoMdDownload } from "react-icons/io";

type imageFormat = 'png' | 'jpeg'

const Download = () => {

    const format: imageFormat = 'png'
    const fileName = 'canvas-image'

  const download = () => {

    const bgCanvas = document.querySelector('#bgCanvas') as HTMLCanvasElement | null
    const drawCanvas = document.querySelector('#drawCanvas') as HTMLCanvasElement | null
    const previewCanvas = document.querySelector('#previewCanvas') as HTMLCanvasElement | null

    if (!bgCanvas || !drawCanvas) {
      console.warn("One or more canvas layers are missing");
      return;
    }

    // Create a temporary canvas
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    tempCanvas.width = bgCanvas.width;
    tempCanvas.height = bgCanvas.height;

    // Draw background layer
    ctx.drawImage(bgCanvas, 0, 0);

    // Draw strokes layer
    ctx.drawImage(drawCanvas, 0, 0);

    // Optionally draw preview layer if you want to include it
    if (previewCanvas) {
      ctx.drawImage(previewCanvas, 0, 0);
    }

    // Get image data
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const dataURL = tempCanvas.toDataURL(mimeType);

    // Trigger download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${fileName}.${format}`;
    link.click();
  }

  return (
      <button 
      onClick={() => {
          download()
      }} 
      className="flex items-center justify-center w-8 rounded-md active:text-gray-400"
      >
          <IoMdDownload />
      </button>
  )
}

export default Download