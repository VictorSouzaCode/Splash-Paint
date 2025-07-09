

// using flattening for:
// Draw that stroke directly onto a “base layer” (commit it to the canvas permanently).
// Take a snapshot of the canvas (an ImageBitmap).
// Clear out the old strokes — they’re no longer needed for redraws because the base layer already contains them.
// Now your canvas only needs to draw: Live strokes (current in-progress stroke) : The snapshot of all previous strokes
// This means no more replaying hundreds/thousands of old strokes.
// Old strokes are flattened → no need to replay them.
// Undo/redo swaps snapshots instantly.

// the DrawingEngine is designed to handle all low-level drawing operations on the canvas.

// As long as i don’t use Redux to store pixel data or stroke history, you’re perfectly fine leaving my tools logic inside redux.

// well i will start to make this code the way it is set up in chatgpt then i will make changes to better fit it in my app

export type Point = {
    x: number,
    y: number
}

export type Stroke = {
    points: Point[],
    color: string,
    size: number
}

// This function takes an HTML <canvas> element and initializes a drawing engine for it.
// Returns an API object at the end, which can be used in React, Vue, or vanilla JS.
// It hides all internals (like snapshots) using closure – this prevents leaking internal state.
export const createDrawingEngine = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if(!ctx) throw new Error('Canvas 2D context not supported')

    // Cache width and height
    // This avoids accessing canvas.width repeatedly (a tiny optimization).
    const width = canvas.width
    const height = canvas.height

    // Internal mutable state
    let snapshots: ImageBitmap[] = [] // Array of ImageBitmaps storing committed canvas states. Used for undo/redo. Efficient for large drawings
    let snapshotIndex = -1 // Tracks which snapshot is currently active. Starts at -1 because no snapshot exists yet.
    let pendingStrokes: Stroke[] = [] // A temporary array holding strokes drawn since the last commit. These strokes are not yet saved to a snapshot. Allows batching multiple strokes before committing.
    let currentStroke: Stroke | null = null // Holds the stroke the user is currently drawing. Becomes null when no active drawing is happening.

    const startStroke = (point: Point, color: string, size: number) => {
        currentStroke = {
            points: [point],
            color,
            size
        }
    } /* Initializes currentStroke.
    Takes: The starting point of the stroke.The selected color and brush size. Stores the first point. */

    // Adds a new point to the current stroke as the user moves the mouse. Calls drawStroke with commit = false:Renders the stroke live without committing it to the base layer.
    // Why not commit immediately? To avoid re-rendering the entire canvas on every mousemove (huge perf gain).
    const updateStroke = (point:Point) => {
        if(!currentStroke) return
        currentStroke.points.push(point)
        drawStroke(currentStroke, false)
    }

    // Why make these functions async?
    // Because createImageBitmap is an asynchronous browser API.
    // createImageBitmap works off the main UI thread. This avoids blocking the browser while it prepares the snapshot.
    // So any function calling createImageBitmap must be async to use await.

    // By marking these functions as async, i Allow the browser to split the work into smaller chunks. Let the event loop handle UI updates and other events in-between operations. Prevent freezing when restoring or committing large canvas states. Even if your current implementation doesn’t have big delays yet, this design prepares for future scalability.
    // later i might want to save snapshots to disk or IndexedDB (both async APIs).
    // Load huge images asynchronously.
    // createImageBitmap is preferred over ctx.getImageData() because: It uses GPU memory instead of CPU memory. It avoids transferring tons of pixel data back and forth to JS land. And, most importantly, it’s non-blocking.

    // 🖌 Finish stroke and commit to base layer
    const endStroke = async () => {
        if(!currentStroke) return

        pendingStrokes.push(currentStroke)
        await commitToSnapShot() // Calls commitToSnapshot to render and save the current canvas state.

        currentStroke = null // Resets currentStroke for the next stroke.
    }

    const undo = async () => {
        if(snapshotIndex <= 0) return
        // Moves the snapshotIndex back and restores that snapshot.
        snapshotIndex--
        await restoreSnapShot()
    }

    const redo = async () => {
        if(snapshotIndex >= snapshots.length - 1) return
        // Moves snapshotIndex forward if possible.
        snapshotIndex++
        await restoreSnapShot()
    }

    const clear = async () => {
        ctx.clearRect(0, 0, width, height)
        snapshots = []
        snapshotIndex = -1
        pendingStrokes = []
    }

     // Draws pendingStrokes to the canvas permanently (commit = true).
    const commitToSnapShot = async () => {
        // Draw pending strokes onto base canvas
        pendingStrokes.forEach((stroke) => {
            drawStroke(stroke, true)
        })
        pendingStrokes = []

        // Creates a new ImageBitmap of the canvas.
        const bitmap = await createImageBitmap(ctx.canvas)
        // Trims any "future" snapshots (if user made changes after undo).
        snapshots = snapshots.slice(0, snapshotIndex + 1)
        // Appends new snapshot and updates snapshotIndex.
        snapshots.push(bitmap)
        snapshotIndex++
    }

    // Clears the canvas and draws the selected snapshot.
    const restoreSnapShot = async () => {
        ctx.clearRect(0, 0, width, height)
        const snapshot = snapshots[snapshotIndex]
        ctx.drawImage(snapshot, 0, 0)
    }

    const drawStroke = (stroke: Stroke, commit: boolean) => {
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        ctx.beginPath()
        const points = stroke.points
        if(points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y)
            // Loops through all points and connects them.
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y)
            }
        }
        ctx.stroke()
        if(commit) {
            ctx.closePath()
        } // If commit is true, it finishes the path.
    }

    // Expose API
    // Only returns the public API.
    // All internals (snapshots, ctx, etc.) are hidden in closure.
    return {
        startStroke,
        updateStroke,
        endStroke,
        undo,
        redo,
        clear
    }
}

// Now i want to connect this with my redux tool