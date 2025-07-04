import type { ToolState } from "../redux/slices/tools";


type ShapeStartPoint = {x:number, y:number} | null

type MousePos = {x:number, y:number}


function drawTriangleShape (
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

/* Draw Circle
    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
*/


export default drawTriangleShape