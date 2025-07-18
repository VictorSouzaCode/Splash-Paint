

import type { ToolState } from "../../redux/slices/tools"
import type { Point, Stroke } from "../../utils/types"
import previewShapesHandler from "../previewShapesHandler"
import previewStrokeHandler from "../previewStrokeHandler"
import drawstrokes from "../drawstrokes"
import drawShapes from "../drawShapes"

let snapshots: ImageBitmap[] = []
let snapshotIndex = -1

export const createDrawingEngine = (canvas: HTMLCanvasElement, canvasPreview: HTMLCanvasElement | null) => {

    if(!canvas || !canvasPreview ) return
    const ctxPreview = canvasPreview.getContext('2d')
    const ctx = canvas.getContext('2d')
    if(!ctx || !ctxPreview) throw new Error('Canvas 2D context not supported')

    const width = canvas.width
    const height = canvas.height

    const previewWidth = canvasPreview.width
    const previewHeight = canvasPreview.height

    let pendingStrokes: Stroke[] = []
    let currentStroke: Stroke | null = null
    let shapeEndingPoint: Point | null = null
    let shapeStartPoint: Point | null = null

    const startStroke = (point: Point, state: ToolState) => {

        if (state.toolForm !== 'circle' && state.toolForm !== 'square') {

            shapeStartPoint = point

        } else {
            const color = state.tool === 'pencil' ? state.pencilColor : state.screenColor

            const size = state.size

            const toolForm = state.toolForm

            currentStroke = {
                points: [point],
                color,
                size,
                toolForm
            }

            const stroke = currentStroke
            const points = currentStroke.points

            previewStrokeHandler({ctxPreview, stroke, points, previewWidth, previewHeight})

        }
    }
    

    const updateStroke = (point:Point, state:ToolState) => {

        if(shapeStartPoint && state.toolForm !== 'circle' && state.toolForm !== 'square') {

            ctxPreview.clearRect(0, 0, previewWidth, previewHeight)

            shapeEndingPoint = point

            previewShapesHandler({state, ctxPreview, shapeStartPoint, shapeEndingPoint})

        }

        if(state.toolForm === 'circle'){

            if (!currentStroke) {return}

            const lastPoint = currentStroke.points[currentStroke.points.length - 1];

            const interpolated = interpolatePoints(lastPoint, point, 2)

            if(currentStroke.points.length === 1) {
                // draw circle on click
                currentStroke.points.push(...interpolated, point)
            } else {
                // remove too much interpolation from circle pencil
                currentStroke.points.push(...interpolated)
            }

            const points = currentStroke.points
            const stroke = currentStroke

            previewStrokeHandler({ctxPreview, stroke, points, previewWidth, previewHeight})

        }

        if(state.toolForm === 'square') {
            
            if (!currentStroke) {return}
            
            const lastPoint = currentStroke.points[currentStroke.points.length - 1];

            const interpolated = interpolatePoints(lastPoint, point, 2)

            currentStroke.points.push(...interpolated)

            const points = currentStroke.points
            const stroke = currentStroke

            previewStrokeHandler({ctxPreview, stroke, points, previewWidth, previewHeight})
            
        } else {
            return
        }
        
    }

    const interpolatePoints = (from: Point, to: Point, step = 1): Point[] => {
        const dx = to.x - from.x
        const dy = to.y - from.y;

        const distance = Math.hypot(dx, dy);
        const steps = Math.ceil(distance / step);
        const result: Point[] = [];
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            result.push({
                x: from.x + dx * t,
                y: from.y + dy * t
            });
        }
        return result
    }

    const endStroke = async (state: ToolState) => {
        if(state.toolForm !== 'circle' && state.toolForm !== 'square' && shapeStartPoint && shapeEndingPoint) {

            const color = state.tool === 'pencil' ? state.pencilColor : state.screenColor
            const size = state.size
            const toolForm = state.toolForm

            const straightLineStroke: Stroke = {
                points: [shapeStartPoint, shapeEndingPoint],
                color,
                size,
                toolForm
            }
            pendingStrokes.push(straightLineStroke)
            await commitToSnapShot()

            shapeStartPoint = null
            shapeEndingPoint = null
            ctxPreview.clearRect(0, 0, previewWidth, previewHeight)
        }
        if(currentStroke) {
        ctxPreview.clearRect(0, 0, previewWidth, previewHeight)
        pendingStrokes.push(currentStroke)
        await commitToSnapShot()
 
        currentStroke = null
        }
    }
    
    const undo = async () => {
        if (snapshotIndex < 0) return
        snapshotIndex--
        await restoreSnapShot()
    }

    const redo = async () => {
        if(snapshotIndex >= snapshots.length - 1) return
        snapshotIndex++
        await restoreSnapShot()
    }

    const clear = async () => {
        if(snapshotIndex < 0) { return };
        ctx.clearRect(0, 0, width, height)
        snapshots = []
        snapshotIndex = -1
        pendingStrokes = []
    }

    const commitToSnapShot = async () => {
        pendingStrokes.forEach((stroke) => {
            drawstrokes({ctx, stroke})
            drawShapes({ctx, stroke, shapeStartPoint, shapeEndingPoint})
        })
        pendingStrokes = []

        const bitmap = await createImageBitmap(ctx.canvas)
        snapshots = snapshots.slice(0, snapshotIndex + 1)
        snapshots.push(bitmap)
        snapshotIndex++
    }

    const restoreSnapShot = async () => {
        ctx.clearRect(0, 0, width, height)
        ctxPreview.clearRect(0, 0, previewHeight, previewWidth)
        if(snapshotIndex >= 0 && snapshotIndex < snapshots.length) {
            const snapshot = snapshots[snapshotIndex]
            ctx.drawImage(snapshot, 0, 0)
        }
    }

    return {
        startStroke,
        updateStroke,
        endStroke,
        undo,
        redo,
        clear
    }
}