import type { ToolState } from "../redux/slices/tools"
import type { Point } from "../utils/types"
import { drawSquareShape, drawCircleShape, drawTriangleShape, drawStraightLine } from "./previewShapesDrawings.ts"

type drawingProps = {
    state: ToolState
    ctxPreview: CanvasRenderingContext2D,
    shapeStartPoint: Point | null,
    shapeEndingPoint: Point | null,
}


const previewShapesHandler = ({
    state, 
    ctxPreview, 
    shapeStartPoint,
    shapeEndingPoint,
}:drawingProps
) => {

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

export default previewShapesHandler