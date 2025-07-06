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
  lineStartPoint: point,
  mousePosLine: point,
  shapeStartPoint: point,
  mousePosShape: point
}

const PreviewDrawings = (
  {
    lineStartPoint, 
    mousePosLine, 
    shapeStartPoint, 
    mousePosShape
  }: PreviewProps
) => {
   const canvasPreviewRef = useRef<HTMLCanvasElement |  null>(null)
   const state = useSelector((state: RootState) => state.tools)
   useResizeCanvas(canvasPreviewRef)

   useEffect(() => {},[])

   useEffect(() => {

    const canvasPreview = canvasPreviewRef.current

    if(!canvasPreview || (!lineStartPoint && !shapeStartPoint) ) return;

    const ctxPreview = canvasPreview.getContext('2d')
    
    if (!ctxPreview) return;

    ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height)

    if(state.toolForm === 'line' && lineStartPoint && mousePosLine) {
      drawStraightLine(ctxPreview, state, lineStartPoint, mousePosLine)
    }

    if (state.toolForm === "square-shape" && shapeStartPoint && mousePosShape) {
    drawSquareShape(ctxPreview, state, shapeStartPoint, mousePosShape)
    }

    if(state.toolForm === 'triangle-shape' && shapeStartPoint && mousePosShape){
      drawTriangleShape(ctxPreview, state, shapeStartPoint, mousePosShape)
    }

    if (state.toolForm === 'circle-shape' && shapeStartPoint && mousePosShape) {
      drawCircleShape(ctxPreview, state, shapeStartPoint, mousePosShape)
    }

  },[mousePosLine, lineStartPoint, mousePosShape, shapeStartPoint, state])

  return (
    <canvas
    ref={canvasPreviewRef}
    className="absolute top-0 left-0 z-0 pointer-events-none bg-transparent border2"
    />
  )
}

export default PreviewDrawings