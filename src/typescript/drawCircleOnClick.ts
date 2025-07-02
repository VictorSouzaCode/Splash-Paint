import type { ToolState } from "../redux/slices/tools";

function drawCircleOnClick (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    x: number,
    y: number,
) {

    const radius = state.size / 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = state.tool === 'pencil' ? state.pencilColor : state.screenColor;
    ctx.fill();
    ctx.closePath();
}

export default drawCircleOnClick