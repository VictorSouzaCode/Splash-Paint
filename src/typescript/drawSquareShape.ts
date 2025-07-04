import type { ToolState } from "../redux/slices/tools";


type ShapeStartPoint = {x:number, y:number} | null

type MousePos = {x:number, y:number}


function drawSquareShape (
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


export default drawSquareShape