import { useRef, useState, useEffect } from "react"
import { useResizeCanvas } from "../hooks/useResizeCanvas"
import type { RootState } from "../redux/store"
import { useSelector } from "react-redux"
import { drawStraightLine } from "../typescript/drawStraightLine"
import { drawSquareShape, drawTriangleShape, drawCircleShape } from "../typescript/drawShapes"
import draw from "../typescript/draw"
import drawSquare from "../typescript/drawSquare"

type point = {x:number, y:number} | null;

type PreviewProps = {
  canvasPreviewRef: React.RefObject<HTMLCanvasElement | null>
  lineStartPoint: point,
  mousePosLine: point
}

const PreviewDrawings = (
  {
    canvasPreviewRef,
    lineStartPoint, 
    mousePosLine,
  }: PreviewProps
) => {
   const state = useSelector((state: RootState) => state.tools)

   useEffect(() => {

    const canvasPreview = canvasPreviewRef.current

    if(!canvasPreview || !lineStartPoint ) return;

    const ctxPreview = canvasPreview.getContext('2d')
    
    if (!ctxPreview) return;

    ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)

    if(state.toolForm === 'line' && lineStartPoint && mousePosLine) {
      drawStraightLine(ctxPreview, state, lineStartPoint, mousePosLine)
    }

    if (state.toolForm === "square-shape" && lineStartPoint && mousePosLine) {
    drawSquareShape(ctxPreview, state, lineStartPoint, mousePosLine)
    }

    if(state.toolForm === 'triangle-shape' && lineStartPoint && mousePosLine){
      drawTriangleShape(ctxPreview, state, lineStartPoint, mousePosLine)
    }

    if (state.toolForm === 'circle-shape' && lineStartPoint && mousePosLine) {
      drawCircleShape(ctxPreview, state, lineStartPoint, mousePosLine)
    }

  },[mousePosLine, lineStartPoint, state])

  return (
    <canvas
    ref={canvasPreviewRef}
    className="absolute top-0 left-0 z-0 pointer-events-none bg-transparent border2"
    />
  )
}

export default PreviewDrawings