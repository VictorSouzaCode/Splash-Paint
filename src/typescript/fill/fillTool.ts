import type { ToolState } from "../../redux/slices/tools";

// i need a way to save the fill color into the history array that stores all the strokes this way i can undo redo fill operations

// after that i will add Edge Smoothing
// it detect which pixels are at the edge of the filled region. These pixels are adjacent to non-filled pixels. For those edge pixels, instead of applying the full fill color, we blend the fill color with the original pixel color to make the transition softer.


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

    const startIdx = startY * canvasWidth + startX;
    const targetColor32Bits = buffer[startIdx]

    if(fillColor32Bits === targetColor32Bits) return;

    const visited = new Uint8Array(canvasWidth * canvasHeight);

    const queue: [number, number][] = [[startX, startY]];
    visited[startIdx] = 1;

    const TOLERANCE = 180;
    const ALPHA_TOLERANCE = 200;

    const withingTolerance = (colorA:number, colorB:number): boolean => {
        const a = [
            (colorA) & 0xff,
            (colorA >> 8) & 0xFF,
            (colorA >> 16) & 0xFF,
            (colorA >> 24) & 0xFF
        ];
        const b = [
            (colorB) & 0xFF,
            (colorB >> 8) & 0xFF,
            (colorB >> 16) & 0xFF,
            (colorB >> 24) & 0xFF
        ];
        return Math.abs(a[0] - b[0]) <= TOLERANCE &&
               Math.abs(a[1] - b[1]) <= TOLERANCE &&
               Math.abs(a[2] - b[2]) <= TOLERANCE &&
               Math.abs(a[3] - b[3]) <= ALPHA_TOLERANCE;
    }

    while(queue.length > 0) {
        const [x, y] = queue.shift()!;
        const idx = y * canvasWidth + x;

        if(!withingTolerance(buffer[idx], targetColor32Bits)) continue;

        buffer[idx] = fillColor32Bits;

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
                if(!visited[nIdx]) {
                    visited[nIdx] = 1;
                    queue.push([nextX, nextY])
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0)
}