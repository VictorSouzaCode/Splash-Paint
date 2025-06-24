//Pure TypeScript drawing logic

import type { ToolState } from "../redux/slices/tools";


function draw (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    startX: number,
    startY: number,
    endX: number,
    endY: number
) {
    ctx.strokeStyle = state.tool === 'pencil' ? state.pencilColor : state.screenColor
    ctx.lineWidth = state.size
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
}

export default draw