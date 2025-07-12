import type { ToolState } from "../redux/slices/tools";

type LineStartPoint = { x:number, y:number }
type Point = { x:number, y:number }

export function drawStraightLine (
    ctx: CanvasRenderingContext2D | null,
    state: ToolState,
    lineStartPoint: LineStartPoint | null,
    point: Point | null
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