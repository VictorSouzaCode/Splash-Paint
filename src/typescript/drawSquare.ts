import type { ToolState } from "../redux/slices/tools";

type Point = { x:number, y:number }


function drawSquare (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    point: Point
) {
    const positionX = point.x - state.size / 2
    const positionY = point.y - state.size / 2

    ctx.fillStyle = state.tool === 'pencil' ? state.pencilColor : state.screenColor;
    ctx.fillRect(positionX, positionY, state.size, state.size)
}


export default drawSquare