import type { Stroke } from "../utils/types"
import drawstrokes from "../typescript/drawstrokes"
import drawShapes from "../typescript/drawShapes"

let ctx: CanvasRenderingContext2D | null = null
let ctxPreview: CanvasRenderingContext2D | null = null
let width = 0
let height = 0

let snapshots: ImageBitmap[] = []
let snapshotIndex = -1

// UN-USED COMPONENT !!!

export const createUndoRedoManager = {
    registerCanvas: (
        canvasCtx: CanvasRenderingContext2D,
        previewCtx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number
    ) => {
        ctx = canvasCtx
        ctxPreview = previewCtx
        width = canvasWidth
        height = canvasHeight

        snapshots = []
        snapshotIndex = -1
        createUndoRedoManager.commitInitialSnapshot()
    },

    commitInitialSnapshot: async () => {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    const bitmap = await createImageBitmap(ctx.canvas)
    snapshots.push(bitmap)
    snapshotIndex = 0
},

    commitToSnapShot: async (pendingStrokes: Stroke[]) => {
        if (!ctx || !ctxPreview) return

        // Trim future snapshots if user had undone
        if (snapshotIndex < snapshots.length - 1) {
            snapshots = snapshots.slice(0, snapshotIndex + 1)
        }

        // Draw the strokes to the main canvas
        pendingStrokes.forEach((stroke) => {
            drawstrokes({ ctx, stroke })
            drawShapes({ ctx, stroke, shapeStartPoint: null, shapeEndingPoint: null })
        })

        const bitmap = await createImageBitmap(ctx.canvas)
        snapshots.push(bitmap)
        snapshotIndex++

        // 🟢 Clear the pending strokes after committing
        pendingStrokes.length = 0
    },

    undo: async () => {
        if (!ctx || !ctxPreview) return
        if (snapshotIndex <= 0) return

        snapshotIndex--
        await createUndoRedoManager.restoreSnapShot()

        // Clear pending strokes so they don’t get re-committed
        // pendingStrokes = []
    },

    redo: async () => {
        if (!ctx || !ctxPreview) return
        if (snapshotIndex >= snapshots.length - 1) return

        snapshotIndex++
        await createUndoRedoManager.restoreSnapShot()

        // Clear pending strokes as well
        // pendingStrokes = []
    },

    clear: () => {
        if (!ctx || !ctxPreview) return

        ctx.clearRect(0, 0, width, height)
        ctxPreview.clearRect(0, 0, ctxPreview.canvas.width, ctxPreview.canvas.height)
        snapshots = []
        snapshotIndex = -1
    },

    restoreSnapShot: async () => {
        if (!ctx || !ctxPreview) return

        ctx.clearRect(0, 0, width, height)
        ctxPreview.clearRect(0, 0, ctxPreview.canvas.width, ctxPreview.canvas.height)

        if (snapshotIndex >= 0 && snapshotIndex < snapshots.length) {
            const snapshot = snapshots[snapshotIndex]
            ctx.drawImage(snapshot, 0, 0)
        }
    },
}