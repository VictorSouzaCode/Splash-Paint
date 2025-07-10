import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { drawStraightLine } from "../typescript/drawStraightLine"
import { drawSquareShape, drawCircleShape, drawTriangleShape } from "../typescript/drawShapes"
import draw from "../typescript/draw"
import drawSquare from "../typescript/drawSquare"
import drawCircleOnClick from "../typescript/drawCircleOnClick"


type PreviewDrawingProps = {
    canvasPreviewRef: React.RefObject<HTMLCanvasElement | null>,
    mousePosLine: { x: number; y: number;} | null,
    lineStartPoint: { x: number; y: number;} | null
}

export const usePreviewDrawing = ({
    canvasPreviewRef,
    mousePosLine,
    lineStartPoint
}:PreviewDrawingProps) => {
    const state = useSelector((state: RootState) => state.tools)

    useEffect(() => {

        const canvasPreview = canvasPreviewRef.current

        if (!canvasPreview || !lineStartPoint) return;

        const ctxPreview = canvasPreview.getContext('2d')

        if (!ctxPreview) return;

        ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)

        if (state.toolForm === 'line' && lineStartPoint && mousePosLine) {
            drawStraightLine(ctxPreview, state, lineStartPoint, mousePosLine)
        }

        if (state.toolForm === "square-shape" && lineStartPoint && mousePosLine) {
            drawSquareShape(ctxPreview, state, lineStartPoint, mousePosLine)
        }

        if (state.toolForm === 'triangle-shape' && lineStartPoint && mousePosLine) {
            drawTriangleShape(ctxPreview, state, lineStartPoint, mousePosLine)
        }

        if (state.toolForm === 'circle-shape' && lineStartPoint && mousePosLine) {
            drawCircleShape(ctxPreview, state, lineStartPoint, mousePosLine)
        }

    },[mousePosLine, lineStartPoint, state])
}