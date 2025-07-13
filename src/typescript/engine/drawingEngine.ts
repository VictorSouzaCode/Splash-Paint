

import type { ToolState } from "../../redux/slices/tools"
import { drawStraightLine } from "../drawStraightLine"
import { drawSquareShape, drawCircleShape, drawTriangleShape } from "../drawShapes"

export type Point = {
    x: number,
    y: number
}

export type Stroke = {
    points: Point[],
    color: string,
    size: number,
    toolForm: string
}

// fix a bug when i draw a square or triangle the borders get rounded
// improve pencil smootheness, i think the traice is to pixeled
// add undo redo to my buttons
// refactor this code and break it down into small pieces
// move ctx drawing to another file
// move undo redo to a separated file

// so i will make the drawing with freehand smoother
// the way i will do that is adding quadratic Bezier curves for smoothing but it needs to have way more points in the points array for it to work properly so...
// i will add Interpolate points as you draw (live smoothing)
/* Right now, your updateStroke pushes raw mouse points as fast as the browser gives them. If the mouse moves too fast, the points get too sparse.

You can fix this by adding interpolated points between two distant mouse events:
*/
// i will do that with the circle freehand then i will do that with squares as well
// it will cost a little bit of performance this method but the drawing will be prettier 

export const createDrawingEngine = (canvas: HTMLCanvasElement, canvasPreview: HTMLCanvasElement | null) => {
    if(!canvas || !canvasPreview ) return
    const ctxPreview = canvasPreview.getContext('2d')
    const ctx = canvas.getContext('2d')
    if(!ctx || !ctxPreview) throw new Error('Canvas 2D context not supported')

    const width = canvas.width
    const height = canvas.height

    const previewWidth = canvasPreview.width
    const previewHeight = canvasPreview.height

    let snapshots: ImageBitmap[] = []
    let snapshotIndex = -1
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
        }
    }

    const updateStroke = (point:Point, state:ToolState) => {

        if(shapeStartPoint && state.toolForm !== 'circle' && state.toolForm !== 'square') {

            ctxPreview.clearRect(0, 0, previewWidth, previewHeight)

            shapeEndingPoint = point

            drawShapePreview(state)

        } else if (currentStroke) {

            const lastPoint = currentStroke.points[currentStroke.points.length - 1];
            const interpolated = interpolatePoints(lastPoint, point, 2) // 2px step

            currentStroke.points.push(...interpolated, point)
            drawStroke(currentStroke, false)
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

    const drawShapePreview = (
    state: ToolState ) => {

        if(state.toolForm === 'line') {
            drawStraightLine(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
        }

        if(state.toolForm === 'square-shape') {
            drawSquareShape(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
        }

        if(state.toolForm === 'triangle-shape'){
            drawTriangleShape(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
        }

        if(state.toolForm === 'circle-shape'){
            drawCircleShape(ctxPreview, state, shapeStartPoint, shapeEndingPoint)
        }
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
        pendingStrokes.push(currentStroke)
        await commitToSnapShot()

        currentStroke = null
        }
    }

    const undo = async () => {
        if(snapshotIndex <= 0) return
        snapshotIndex--
        await restoreSnapShot()
    }

    const redo = async () => {
        if(snapshotIndex >= snapshots.length - 1) return
        snapshotIndex++
        await restoreSnapShot()
    }

    const clear = async () => {
        ctx.clearRect(0, 0, width, height)
        snapshots = []
        snapshotIndex = -1
        pendingStrokes = []
    }

    const commitToSnapShot = async () => {
        pendingStrokes.forEach((stroke) => {
            drawStroke(stroke, true)
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

    const drawStroke = (stroke: Stroke, commit: boolean) => {

        if(stroke.toolForm === 'line' && stroke.points.length === 2) {
            const points = stroke.points
            const startX = stroke.points[0].x
            const startY = stroke.points[0].y

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            for(let i = 1; i < points.length; i++){
            ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = stroke.color
            ctx.lineWidth = stroke.size;
            ctx.lineCap = 'round'
            ctx.stroke();
            }
        }

        if(stroke.toolForm === 'square-shape' && stroke.points.length === 2 && shapeStartPoint && shapeEndingPoint){

            const start = shapeStartPoint;
            const end = shapeEndingPoint;
            const width = end.x - start.x;
            const height = end.y - start.y;

            ctx.strokeStyle = stroke.color
            ctx.lineWidth = stroke.size;
            ctx.beginPath()
            ctx.strokeRect(start.x, start.y, width, height);
        }

        if(stroke.toolForm === 'triangle-shape' && stroke.points.length === 2 && shapeStartPoint && shapeEndingPoint){

            const start = shapeStartPoint;
            const end = shapeEndingPoint;
            const triangleWidth = end.x - start.x;
            const triangleHeight = end.y - start.y;
            
            ctx.strokeStyle = stroke.color
            ctx.lineWidth = stroke.size;
            ctx.beginPath();
            ctx.moveTo(start.x + triangleWidth / 2, start.y);
            ctx.lineTo(start.x, start.y + triangleHeight);
            ctx.lineTo(start.x + triangleWidth, start.y + triangleHeight);
            ctx.closePath();
            ctx.stroke();

        }

        if(stroke.toolForm === 'circle-shape' && stroke.points.length === 2 && shapeStartPoint && shapeEndingPoint){

            const start = shapeStartPoint;
            const end = shapeEndingPoint;

            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const radius = Math.sqrt(dx * dx + dy * dy) / 2;

            const centerX = (start.x + end.x) / 2;
            const centerY = (start.y + end.y) / 2;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = stroke.color
            ctx.lineWidth = stroke.size;
            ctx.stroke();

        }

        if(stroke.toolForm === 'circle') {

        const radius = stroke.size / 2
        const circleX = stroke.points[0].x
        const circleY = stroke.points[0].y

        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        ctx.beginPath()
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2)
        ctx.fillStyle = stroke.color
        ctx.fill()
        ctx.closePath()
        
        const points = stroke.points

        ctx.beginPath()
        if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);

        // Loop until the second-to-last point to avoid points[i+1] being undefined
        for (let i = 1; i < points.length - 1; i++) {
            const midPointX = (points[i].x + points[i + 1].x) / 2;
            const midPointY = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, midPointX, midPointY);
        }

        // Draw a straight line to the last point to close the path
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }

    ctx.stroke();
        if(commit) {
            ctx.closePath()
        }
        }

        if(stroke.toolForm === 'square') {

            const points = stroke.points

            const positionX = points[0].x - stroke.size / 2
            const positionY = points[0].y - stroke.size / 2
            ctx.beginPath()
            ctx.fillStyle = stroke.color
            ctx.fillRect(positionX, positionY, stroke.size, stroke.size)
            if(points.length > 0) {

                for(let i = 1; i < points.length; i++){
                    const positionX = points[i].x - stroke.size / 2
                    const positionY = points[i].y - stroke.size / 2

                    ctx.fillRect(positionX, positionY, stroke.size, stroke.size)
                }
                ctx.closePath()
            }
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