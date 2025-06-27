import type { ToolState } from "../redux/slices/tools";


function drawSquare (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    x: number,
    y: number
) {
    const positionX = x - state.size / 2
    const positionY = y - state.size / 2

    ctx.fillStyle = state.tool === 'pencil' ? state.pencilColor : state.screenColor;
    ctx.fillRect(positionX, positionY, state.size, state.size)
}


export default drawSquare