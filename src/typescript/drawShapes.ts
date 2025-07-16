import type { ToolState } from "../redux/slices/tools";


type ShapeStartPoint = {x:number, y:number} | null;

type MousePosLine = {x:number, y:number} | null;

export function drawStraightLine (
    ctx: CanvasRenderingContext2D | null,
    state: ToolState,
    lineStartPoint: ShapeStartPoint | null,
    point: MousePosLine | null
) {
    if(!ctx || !lineStartPoint || !point) return

    if(state.toolForm === 'line') {
      ctx.beginPath();
      ctx.moveTo(lineStartPoint.x, lineStartPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
      ctx.lineWidth = state.size;
      ctx.lineCap = 'round'
      ctx.stroke();
    } else {
        return
    }
}

export function drawSquareShape (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    shapeStartPoint: ShapeStartPoint,
    mousePos: MousePosLine

) {

    if(!ctx || !shapeStartPoint || !mousePos) { return }

    const start = shapeStartPoint;
    const end = mousePos;
    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
    ctx.lineWidth = state.size;
    ctx.beginPath()
    ctx.strokeRect(start.x, start.y, width, height);
}


export function drawTriangleShape (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    shapeStartPoint: ShapeStartPoint,
    mousePos: MousePosLine

) {

    if(!shapeStartPoint || !mousePos) { return }

    const start = shapeStartPoint;
    const end = mousePos;
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


export function drawCircleShape (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    shapeStartPoint: ShapeStartPoint,
    mousePos: MousePosLine
) {

    if (!shapeStartPoint || !mousePos) return;

    const start = shapeStartPoint;
    const end = mousePos;

    // Calculate radius using the distance between start and end points
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const radius = Math.sqrt(dx * dx + dy * dy) / 2;

    // Calculate center of the circle
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
    ctx.lineWidth = state.size;
    ctx.stroke();
}