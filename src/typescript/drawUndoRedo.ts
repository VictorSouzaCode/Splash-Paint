
// Now i need to know how i am going to do this

// here i am just re-drawing the path, the color width and other stuff are being re-redering on other parts of the code
// now the question is, do i make a saperate function like this one to draw the lines from the storedStrokes array or i make it on each one of my already existing files?

// another question do i need to include width color here or i am good
// another question how i am going to retrace eraser, square pencil, and circle on a click?
// because the logic to draw a square a circle and a rounded line are different
import type { ToolState } from "../redux/slices/tools"

type StoredStrokes = {x:number, y: number}

function drawUndoRedo (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    strokes: StoredStrokes[]
) {
  const isEraser = state.tool === 'eraser';
  const fill = isEraser ? state.screenColor : state.pencilColor;
  ctx.fillStyle = fill;
  ctx.strokeStyle = fill;
  ctx.lineWidth = state.size;

  if (state.toolForm === 'square') {
    for (let i = 0; i < strokes.length; i++) {
      const p = strokes[i];
      ctx.fillRect(p.x - state.size / 2, p.y - state.size / 2, state.size, state.size);
    }
  }

  if (state.toolForm === 'circle') {
    ctx.beginPath();
    for (let i = 1; i < strokes.length; i++) {
      const from = strokes[i - 1];
      const to = strokes[i];
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
    }
    ctx.stroke();
}
}

export default drawUndoRedo