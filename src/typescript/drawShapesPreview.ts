import type { ToolState } from "../redux/slices/tools"
import type { Point } from "../utils/types"
import { drawSquareShape, drawCircleShape, drawTriangleShape, drawStraightLine } from "../typescript/drawShapes"

type functionProps = {
    state: ToolState
    ctxPreview: CanvasRenderingContext2D,
    shapeStartPoint: Point | null,
    shapeEndingPoint: Point | null,
}


const drawShapesPreview = ({
    state, 
    ctxPreview, 
    shapeStartPoint,
    shapeEndingPoint,
}:functionProps
) => {

    ctxPreview.lineCap = 'butt'
    ctxPreview.lineJoin = 'miter'

    if (state.toolForm === 'line') {
        drawStraightLine(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
    }

    if (state.toolForm === 'square-shape') {
        drawSquareShape(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
    }

    if (state.toolForm === 'triangle-shape') {
        drawTriangleShape(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
    }

    if (state.toolForm === 'circle-shape') {
        drawCircleShape(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
    }
}

export default drawShapesPreview