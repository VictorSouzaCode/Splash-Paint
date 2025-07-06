import { useEffect } from "react"

type UseEffectProps = {
    canvas: HTMLCanvasElement,
    prevPos: {x: number, y: number},
    currentPosition: React.RefObject<{x: number, y: number;}[]>,
    lineStartPoint: {x: number, y: number},
    mousePosLine: {x: number, y: number},
    shapeStartPoint: {x: number, y: number},
    mousePosShape: {x: number, y: number}
}

export const useCanvasEvents = ({
    canvas,
    prevPos,
    currentPosition,
    lineStartPoint,
    mousePosLine,
    shapeStartPoint,
    mousePosShape
}:UseEffectProps) => {
    console.log(canvas)
}