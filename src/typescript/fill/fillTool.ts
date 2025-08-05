import type { ToolState } from "../../redux/slices/tools";

// i need a way to save the fill color into the history array that stores all the strokes this way i can undo redo fill operations

// after that i will add Edge Smoothing
// it detect which pixels are at the edge of the filled region. These pixels are adjacent to non-filled pixels. For those edge pixels, instead of applying the full fill color, we blend the fill color with the original pixel color to make the transition softer.

// Problems that i have, i dont know How to solve yet

// if the stroke is too thin, the fill tool will scape to the outside area filling all the canvas

// the fill tool is not include in the in the undo redo function


function hextoRgba(hex: string): [number, number, number, number] {
    // Remove the hash (#) if present
    hex = hex.replace(/^#/, '');

    // Handle shorthand hex (#000) => #000000
    if(hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length >= 8 ? parseInt(hex.substring(6, 8), 16) : 255;

    return [r, g, b, a]
}

// function colorMatch(a:number[], b:number[], tolerance = 190):boolean{
//     return Math.abs(a[0] - b[0]) <= tolerance &&
//            Math.abs(a[1] - b[1]) <= tolerance &&
//            Math.abs(a[2] - b[2]) <= tolerance &&
//            Math.abs(a[3] - b[3]) <= 230;
// }

export function fillTool (

    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    state: ToolState,

) {

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    const buffer = new Uint32Array(data.buffer); // RGBA as 32-bit integer per pixel

    const fillColor = hextoRgba(state.pencilColor)
    const fillColor32Bits = (new Uint32Array(new Uint8Array(fillColor).buffer))[0]

    // The pixel index at the clicked position.
    const startIdx = startY * canvasWidth + startX;
    // The color i want to replace.
    const targetColor32Bits = buffer[startIdx]

    if(fillColor32Bits === targetColor32Bits) return;

    // A simple 1-byte-per-pixel array to track which pixels we've already processed. Prevents infinite loops or redundant checks.
    const visited = new Uint8Array(canvasWidth * canvasHeight);

    // Queue for Flood Fill (BFS Algorithm)
    // This uses a Breadth-First Search (BFS) approach using a queue. Starts with the pixel clicked by the user.
    const queue: [number, number][] = [[startX, startY]];
    visited[startIdx] = 1;
    const edgePixels: number[] = [] // Store 1D index of edge pixels

    // How much RGB values can differ and still be considered a match.
    const TOLERANCE = 80;
    const ALPHA_TOLERANCE = 120; // How much transparency (alpha) can differ.

    const colorDistance = (c1: number, c2: number) => {
        const r1 = c1 & 0xFF, g1 = (c1 >> 8) & 0xFF, b1 = (c1 >> 16) & 0xFF, a1 = (c1 >> 24) & 0xFF;
        const r2 = c2 & 0xFF, g2 = (c2 >> 8) & 0xFF, b2 = (c2 >> 16) & 0xFF, a2 = (c2 >> 24) & 0xFF;

        const dr = r1 - r2;
        const dg = g1 - g2;
        const db = b1 - b2;
        const da = a1 - a2;

        return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
    };

    const COLOR_DISTANCE_THRESHOLD = 10;

    // Color Comparison Helper
    // Extracts RGBA channels from 32-bit values using bitwise operations. Compares two pixels and returns true if they are close enough to be considered the same color.
    const withingTolerance = (colorA:number, colorB:number): boolean => {
        return colorDistance(colorA, colorB) <= COLOR_DISTANCE_THRESHOLD;
    }

    // Main Fill Loop
    // Picks the next pixel in the queue. If it matches the target color, fill it. If not, skip it.
    while(queue.length > 0) {
        const [x, y] = queue.shift()!;
        const idx = y * canvasWidth + x;

        if(!withingTolerance(buffer[idx], targetColor32Bits)) continue;

        buffer[idx] = fillColor32Bits;

        let isEdge = false;

        // Checks all 8 directions around the current pixel (4 or 8-way connectivity).
        // If the neighbor hasn't been visited, and it's inside the canvas, add it to the queue.
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], // 4-connected
            [-1, -1], [-1, 1], [1, -1], [1, 1],
        ];

        for(const [dx, dy] of directions) {
            const nextX = x + dx;
            const nextY = y + dy;

            if(
                nextX >= 0 && nextX < canvasWidth && nextY >= 0 && nextY < canvasHeight 
            ) {
                const nIdx = nextY * canvasWidth + nextX;
                if (!visited[nIdx]) {
                    if (withingTolerance(buffer[nIdx], targetColor32Bits)) {
                        queue.push([nextX, nextY]);
                        visited[nIdx] = 1;
                    } else {
                        isEdge = true;
                    }
                }
            }
        }

        if(isEdge) {
            edgePixels.push(idx);
        }
    }

    // Blend Edge Pixels After Flood Fill
    // After the main fill loop and before ctx.putImageData(...)
    const blendColors = (orig: number, fill:number, factor:number) => {
        const r1 = orig & 0xff;
    const g1 = (orig >> 8) & 0xff;
    const b1 = (orig >> 16) & 0xff;
    const a1 = (orig >> 24) & 0xff;

    const r2 = fill & 0xff;
    const g2 = (fill >> 8) & 0xff;
    const b2 = (fill >> 16) & 0xff;
    const a2 = (fill >> 24) & 0xff;

    const r = Math.round(r1 * (1 - factor) + r2 * factor);
    const g = Math.round(g1 * (1 - factor) + g2 * factor);
    const b = Math.round(b1 * (1 - factor) + b2 * factor);
    const a = Math.round(a1 * (1 - factor) + a2 * factor);

    return r | (g << 8) | (b << 16) | (a << 24);
    }

    // Secondary pass: fill unvisited pixels that are very close to visited ones and within tolerance
    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const idx = y * canvasWidth + x;

            if (visited[idx]) continue; // already filled

            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1],
            ];

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && ny >= 0 && nx < canvasWidth && ny < canvasHeight) {
                    const nIdx = ny * canvasWidth + nx;
                    if (visited[nIdx] && withingTolerance(buffer[idx], targetColor32Bits)) {
                        buffer[idx] = fillColor32Bits;
                        visited[idx] = 1;
                        break;
                    }
                }
            }
        }
    }

    //Dilation
    for (const idx of edgePixels) {
        const x = idx % canvasWidth;
        const y = Math.floor(idx / canvasWidth);

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < canvasWidth && ny < canvasHeight) {
                const nIdx = ny * canvasWidth + nx;
                if (!visited[nIdx]) {
                    buffer[nIdx] = fillColor32Bits;
                    visited[nIdx] = 1; // mark it visited
                }
            }
        }
    }

    // Apply blur to edge pixels
    for (const idx of edgePixels) {
        const originalColor = buffer[idx];
        const blendedColor = blendColors(originalColor, fillColor32Bits, 0.3); // 0.3 = softness
        buffer[idx] = blendedColor;
    }
    // factor: determines how soft the edge looks. 0.0 = original color, 1.0 = full fill color. Try 0.2 - 0.4 for best results.

    // After modifying the imageData, this puts it back on the canvas to make changes visible.
    ctx.putImageData(imageData, 0, 0)
}