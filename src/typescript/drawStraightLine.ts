import type { ToolState } from "../redux/slices/tools";

type LineStartPoint = { x:number, y:number }
type Point = { x:number, y:number }

export function drawStraightLine (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    lineStartPoint: LineStartPoint,
    point: Point
) {

      ctx.beginPath();
      ctx.moveTo(lineStartPoint.x, lineStartPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = state.tool === 'eraser' ? state.screenColor : state.pencilColor;
      ctx.lineWidth = state.size;
      ctx.lineCap = 'round'
      ctx.stroke();
}