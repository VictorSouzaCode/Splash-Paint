

import type { ToolState } from "../redux/slices/tools";

type PrevPos = { x:number, y:number } | null;

type CurrentPosition = { x:number, y:number }


function draw (
    ctx: CanvasRenderingContext2D,
    state: ToolState,
    prevPos: PrevPos,
    currentPos: CurrentPosition
) {

    if(!prevPos) return

    ctx.strokeStyle = state.tool === 'pencil' ? state.pencilColor : state.screenColor
    ctx.lineWidth = state.size
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(prevPos.x, prevPos.y)
    ctx.lineTo(currentPos.x, currentPos.y)
    ctx.stroke()
}

export default draw