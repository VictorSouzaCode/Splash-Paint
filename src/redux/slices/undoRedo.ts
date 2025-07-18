import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Stroke } from "../../utils/types"
import drawstrokes from "../../typescript/drawstrokes"
import drawShapes from "../../typescript/drawShapes"

type UndoRedoState = {
    ctx: CanvasRenderingContext2D | null
    ctxPreview: CanvasRenderingContext2D | null
    width: number
    height: number
    snapshots: ImageBitmap[]
    snapshotIndex: number
}

const initialState: UndoRedoState = {
    ctx: null,
    ctxPreview: null,
    width: 0,
    height: 0,
    snapshots: [],
    snapshotIndex: -1
}

// Async thunk to commit an initial snapshot
export const commitInitialSnapshot = createAsyncThunk(
    "undoRedo/commitInitialSnapshot",
    async (_, { getState }) => {
        const state = getState() as { undoRedo: UndoRedoState }
        const { ctx, width, height } = state.undoRedo
        if (!ctx) return null
        ctx.clearRect(0, 0, width, height)
        return await createImageBitmap(ctx.canvas)
    }
)

// Async thunk to commit new strokes
export const commitToSnapshot = createAsyncThunk(
    "undoRedo/commitToSnapshot",
    async (pendingStrokes: Stroke[], { getState }) => {
        const state = getState() as { undoRedo: UndoRedoState }
        const { ctx, ctxPreview, snapshotIndex, snapshots } = state.undoRedo
        if (!ctx || !ctxPreview) return null

        // Trim future snapshots if user had undone
        const trimmedSnapshots =
            snapshotIndex < snapshots.length - 1
                ? snapshots.slice(0, snapshotIndex + 1)
                : snapshots

        // Draw pending strokes
        pendingStrokes.forEach((stroke) => {
            drawstrokes({ ctx, stroke })
            drawShapes({ ctx, stroke, shapeStartPoint: null, shapeEndingPoint: null })
        })

        const bitmap = await createImageBitmap(ctx.canvas)
        return {
            bitmap,
            trimmedSnapshots
        }
    }
)

/* : PayloadAction<{
    ctx: CanvasRenderingContext2D | null
    ctxPreview: CanvasRenderingContext2D | null
    width: number
    height: number
}> */

// Slice definition
const undoRedoSlice = createSlice({
    name: "undoRedo",
    initialState,
    reducers: {
        registerCanvas: (
            state,
            action
        ) => {
            const { ctx, ctxPreview, width, height } = action.payload
            state.ctx = ctx
            state.ctxPreview = ctxPreview
            state.width = width
            state.height = height
            state.snapshots = []
            state.snapshotIndex = -1
        },

        undo: (state) => {
            if (state.snapshotIndex <= 0) return
            state.snapshotIndex--
        },

        redo: (state) => {
            if (state.snapshotIndex >= state.snapshots.length - 1) return
            state.snapshotIndex++
        },

        clearCanvas: (state) => {
            if (state.ctx && state.ctxPreview) {
                state.ctx.clearRect(0, 0, state.width, state.height)
                state.ctxPreview.clearRect(
                    0,
                    0,
                    state.ctxPreview.canvas.width,
                    state.ctxPreview.canvas.height
                )
            }
            state.snapshots = []
            state.snapshotIndex = -1
        }
    },
    extraReducers: (builder) => {
        builder.addCase(commitInitialSnapshot.fulfilled, (state, action) => {
            if (action.payload) {
                state.snapshots.push(action.payload)
                state.snapshotIndex = 0
            }
        })
        builder.addCase(commitToSnapshot.fulfilled, (state, action) => {
            if (action.payload) {
                const { bitmap, trimmedSnapshots } = action.payload
                state.snapshots = [...trimmedSnapshots, bitmap]
                state.snapshotIndex++
            }
        })
    }
})

export const { registerCanvas, undo, redo, clearCanvas } = undoRedoSlice.actions

export default undoRedoSlice.reducer