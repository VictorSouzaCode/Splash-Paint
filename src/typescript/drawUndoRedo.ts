
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

      const getPosition = strokes[i];

      const positionX = getPosition.x - state.size / 2;
      const positionY = getPosition.y - state.size / 2;

      ctx.fillRect(positionX, positionY, state.size, state.size);
    }
  }

  // This is a pairwise loop — each iteration processes two points:
  // This is perfect for reconstructing a stroke as a series of connected lines.
  // Plain for loops are the fastest in JavaScript.
  if (state.toolForm === 'circle') {
    ctx.beginPath();
    for (let i = 1; i < strokes.length; i++) {
      const from = strokes[i - 1]; // This gets the previous point in the stroke history so i can draw a line from it to the current point.
      const to = strokes[i];
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
    }
    ctx.stroke();
  }

  if (state.toolForm === 'square-shape') {
  const [start, end] = strokes;
  if (!start || !end) return;

  const width = end.x - start.x;
  const height = end.y - start.y;

  ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
  ctx.lineWidth = state.size;
  ctx.strokeRect(start.x, start.y, width, height);
  }


  if(state.toolForm === 'triangle-shape') {
    
    const [start, end] = strokes;
    if(!start || !end) return

    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
    ctx.lineWidth = state.size;
    ctx.beginPath();
    ctx.moveTo(start.x + width / 2, start.y);
    ctx.lineTo(start.x, start.y + height);
    ctx.lineTo(start.x + width, start.y + height);
    ctx.closePath();
    ctx.stroke();
  }

  if (state.toolForm === 'circle-shape') {
  const [start, end] = strokes;
  if (!start || !end) return;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const radius = Math.sqrt(dx * dx + dy * dy) / 2;
  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
  ctx.lineWidth = state.size;
  ctx.stroke();
}
}

export function redrawStraightLine (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    strokes: StoredStrokes[]
) {

  if(state.toolForm === 'line') {
  ctx.beginPath();
  const [start, end] = strokes;
  if (!start || !end) return;
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
  ctx.lineWidth = state.size;
  ctx.stroke();
  }
}

export function redrawCircleOnClick (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    strokes: StoredStrokes[]
) {

    if(state.toolForm === 'circle') {
      for (let i = 0; i < strokes.length; i++) {
      const position = strokes[i];
      const radius = state.size / 2

      ctx.beginPath();
      ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }
    }
}

export default drawUndoRedo