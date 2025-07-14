

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
// add undo redo to my buttons
// refactor this code and break it down into small pieces
// move ctx drawing to another file
// move undo redo to a separated file

// improve pencil smootheness, *
// now i need to work on some problems caused by this new feature
// square pencil needs interpolation to work properly *
// square pencil doens't have preview line
// preview pencil square forms are rounded now
// preview and final shapes have rounded corners

// Now i dont know what to choose, interporlation is better for perfomance but it gets a little weird on slow strokes
// i need to use interpolation on square, but i dont want to use it on circle pincil, so when the user change tools he is gonna se the difference, or a let everything fast but with a little bit of weirdness on slow drawing, or i make everything slow and the drawing slow a little bit better

// i think i will use interpolation for everything, i think i can tolarate some weird traces better than a slow app


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

            if(state.toolForm === 'circle') {
            drawPreviewCircle(currentStroke)
            }

        }
    }
    

    const updateStroke = (point:Point, state:ToolState) => {

        if(shapeStartPoint && state.toolForm !== 'circle' && state.toolForm !== 'square') {

            ctxPreview.clearRect(0, 0, previewWidth, previewHeight)

            shapeEndingPoint = point

            drawShapePreview(state)

        }

        if(state.toolForm === 'circle'){

            if (!currentStroke) {return}

            const lastPoint = currentStroke.points[currentStroke.points.length - 1];

            const interpolated = interpolatePoints(lastPoint, point, 2)

            currentStroke.points.push(...interpolated, point)

            drawPreviewStroke(currentStroke, currentStroke.points)
        }

        if(state.toolForm === 'square') {
            
            if (!currentStroke) {return}
            
            const lastPoint = currentStroke.points[currentStroke.points.length - 1];

            const interpolated = interpolatePoints(lastPoint, point, 2)

            currentStroke.points.push(...interpolated, point)

            drawPreviewSquareStroke(currentStroke, currentStroke.points)
            
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

    const drawPreviewCircle = (currentStroke:Stroke) => {
        const radius = currentStroke.size / 2
        const circleX = currentStroke.points[0].x
        const circleY = currentStroke.points[0].y

        ctxPreview.clearRect(0, 0, previewWidth, previewHeight);
        ctxPreview.beginPath()
        ctxPreview.arc(circleX, circleY, radius, 0, Math.PI * 100)
        ctxPreview.fillStyle = currentStroke.color
        ctxPreview.fill()
        ctxPreview.closePath()
    }

    const drawPreviewSquareStroke = (stroke:Stroke, points:Point[]) => {

        ctxPreview.clearRect(0, 0, previewWidth, previewHeight);
        for (let i = 1; i < points.length; i++) {
            const positionX = points[i].x - stroke.size / 2
            const positionY = points[i].y - stroke.size / 2

            ctxPreview.fillRect(positionX, positionY, stroke.size, stroke.size)
        }
        ctxPreview.closePath()
    }

    const drawPreviewStroke = (stroke:Stroke, points:Point[]) => {
        const color = stroke.color;
        const size  = stroke.size

        if(stroke.toolForm === 'circle') {
            ctxPreview.clearRect(0, 0, previewWidth, previewHeight);
            ctxPreview.strokeStyle = color;
            ctxPreview.lineWidth = size;
            ctxPreview.lineJoin = 'round';
            ctxPreview.lineCap = 'round';
            ctxPreview.beginPath();
            ctxPreview.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctxPreview.lineTo(points[i].x, points[i].y);
            }
            ctxPreview.stroke();
        }
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
        ctxPreview.clearRect(0, 0, previewWidth, previewHeight)
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

            if(stroke.points.length === 1) {
                const radius = stroke.size / 2
                const circleX = stroke.points[0].x
                const circleY = stroke.points[0].y

                ctx.beginPath()
                ctx.arc(circleX, circleY, radius, 0, Math.PI * 100)
                ctx.fillStyle = stroke.color
                ctx.fill()
                ctx.closePath()
            } // surprisingly doing this if statement improves performance

        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        const points = stroke.points

            ctx.beginPath()
            if (points.length > 0) {
                // Not enough points for smoothing
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
            }
            ctx.stroke();
            if(commit) {
                ctx.closePath()
            }
        }

        if(stroke.toolForm === 'square') {

            const points = stroke.points // normal points here for visual fidelity

            const positionX = points[0].x - stroke.size / 2
            const positionY = points[0].y - stroke.size / 2
            if(points.length === 1) {
                ctx.beginPath()
                ctx.fillStyle = stroke.color
                ctx.fillRect(positionX, positionY, stroke.size, stroke.size)
            }
            
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