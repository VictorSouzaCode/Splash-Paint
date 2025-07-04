import type { ToolState } from "../redux/slices/tools";


type ShapeStartPoint = {x:number, y:number} | null

type MousePos = {x:number, y:number}


export function drawSquareShape (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    shapeStartPoint: ShapeStartPoint,
    mousePos: MousePos

) {

    if(!shapeStartPoint) { return }

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
    mousePos: MousePos

) {

    if(!shapeStartPoint) { return }

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
    mousePos: MousePos
) {

    if (!shapeStartPoint) return;

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