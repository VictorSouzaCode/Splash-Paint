

import type { ToolState } from "../../redux/slices/tools"
import { store } from "../../redux/store"

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

export const createDrawingEngine = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if(!ctx) throw new Error('Canvas 2D context not supported')

    const width = canvas.width
    const height = canvas.height

    let snapshots: ImageBitmap[] = []
    let snapshotIndex = -1
    let pendingStrokes: Stroke[] = []
    let currentStroke: Stroke | null = null

    const startStroke = (point: Point, toolState: ToolState) => {
        const color = toolState.tool === 'pencil' ? toolState.pencilColor : toolState.screenColor

        const size = toolState.size

        const toolForm = toolState.toolForm

        currentStroke = {
            points: [point],
            color,
            size,
            toolForm
        }
    }

    const updateStroke = (point:Point) => {
        if(!currentStroke) return
        currentStroke.points.push(point)
        drawStroke(currentStroke, false)
    }

    const endStroke = async () => {
        if(!currentStroke) return

        pendingStrokes.push(currentStroke)
        await commitToSnapShot()

        currentStroke = null
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
        const snapshot = snapshots[snapshotIndex]
        ctx.drawImage(snapshot, 0, 0)
    }

    const drawStroke = (stroke: Stroke, commit: boolean) => {

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

        ctx.beginPath()
        const points = stroke.points
        if(points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y)
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y)
            }
        }
        ctx.stroke()
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