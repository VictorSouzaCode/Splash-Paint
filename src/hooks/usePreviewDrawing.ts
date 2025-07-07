import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { drawStraightLine } from "../typescript/drawStraightLine"
import { drawSquareShape, drawCircleShape, drawTriangleShape } from "../typescript/drawShapes"


type PreviewDrawingProps = {
    canvasPreviewRef: React.RefObject<HTMLCanvasElement | null>,
    mousePosLine: { x: number; y: number;} | null,
    lineStartPoint: { x: number; y: number;} | null,
    mousePosShape: { x: number; y: number;} | null,
    shapeStartPoint: { x: number; y: number;} | null,
}

export const usePreviewDrawing = ({
    canvasPreviewRef,
    mousePosLine,
    lineStartPoint,
    mousePosShape,
    shapeStartPoint
}:PreviewDrawingProps) => {
    const state = useSelector((state: RootState) => state.tools)

    useEffect(() => {

        const canvasPreview = canvasPreviewRef.current

        if (!canvasPreview || (!lineStartPoint && !shapeStartPoint)) return;

        const ctxPreview = canvasPreview.getContext('2d')

        if (!ctxPreview) return;

        ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)

        if (state.toolForm === 'line' && lineStartPoint && mousePosLine) {
            drawStraightLine(ctxPreview, state, lineStartPoint, mousePosLine)
        }

        if (state.toolForm === "square-shape" && lineStartPoint && mousePosShape) {
            drawSquareShape(ctxPreview, state, lineStartPoint, mousePosShape)
        }

        if (state.toolForm === 'triangle-shape' && lineStartPoint && mousePosShape) {
            drawTriangleShape(ctxPreview, state, lineStartPoint, mousePosShape)
        }

        if (state.toolForm === 'circle-shape' && lineStartPoint && mousePosShape) {
            drawCircleShape(ctxPreview, state, lineStartPoint, mousePosShape)
        }

    },[mousePosLine, lineStartPoint, mousePosShape, shapeStartPoint])
}