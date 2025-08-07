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


export function fillTool (

    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    state: ToolState,

) {

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight); // Gets all pixel data from the canvas (in 8-bit RGBA format).
    const pixels = new Uint32Array(imageData.data.buffer); // Groups every 4 bytes into one 32-bit number so we can process 1 pixel at a time efficiently.

    const fillColor = hextoRgba(state.pencilColor) // hextoRgba converts hex like #ff0000 into [255, 0, 0, 255].
    const fillColor32Bits = new Uint32Array(new Uint8Array(fillColor).buffer)[0]; // wraps it into a 32-bit RGBA integer.

    // The pixel index at the clicked position.
    const startindex = startY * canvasWidth + startX;
    // The color i want to replace.
    const targetColor32Bits = pixels[startindex]

    if(fillColor32Bits === targetColor32Bits) return; // If the color you're trying to fill is already the same, exit early.

    // A simple 1-byte-per-pixel array to track which pixels i've already processed. Prevents infinite loops or redundant checks.
    const visited = new Uint8Array(canvasWidth * canvasHeight);

    // Queue for Flood Fill (BFS Algorithm)
    // This uses a Breadth-First Search (BFS) approach using a queue.
    const queue: [number, number][] = [[startX, startY]];
    visited[startindex] = 1; // Starts with the pixel clicked by the user.

    const edgePixels: number[] = [] // Store 1D index of edge pixels

    // Direction vectors for 8-connected neighbors
    // If the neighbor hasn't been visited, and it's inside the canvas, add it to the queue.
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // 4-connected // // Up, down, left, right
        [-1, -1], [-1, 1], [1, -1], [1, 1], // // Diagonals
    ];

    // Extracts RGBA channels from two 32-bit colors.
    const colorDifference = (c1: number, c2: number) => {
        const r1 = c1 & 0xff;
        const g1 = (c1 >> 8) & 0xff;
        const b1 = (c1 >> 16) & 0xff;
        const a1 = (c1 >> 24) & 0xff;

        const r2 = c2 & 0xff;
        const g2 = (c2 >> 8) & 0xff;
        const b2 = (c2 >> 16) & 0xff;
        const a2 = (c2 >> 24) & 0xff;

        const dr = r1 - r2;
        const dg = g1 - g2;
        const db = b1 - b2;
        const da = a1 - a2;

        return dr * dr + dg * dg + db * db + da * da;
    }; // Calculates the sum of squared differences. and tells how similar two colors are.

    const isSimilarColor = (c1:number, c2:number) => {
        return colorDifference(c1, c2) <= 100;// 10^2 tolerance (no sqrt) If color distance is less or equal to 100, consider them the same. Tolerance for how far apart colors can be and still be “fillable.”
    }

    // --------- FLOOD FILL LOOP (BFS) ----------
    // Picks the next pixel in the queue. If it matches the target color, fill it. If not, skip it.
    while(queue.length > 0) {
        // Current pixel coordinates
        const [x, y] = queue.shift()!;
        const index = y * canvasWidth + x;

        if(!isSimilarColor(pixels[index], targetColor32Bits)) continue;

        pixels[index] = fillColor32Bits;


        let isEdge = false;
        // Each [dx, dy] is a direction offset — how far to move from the current pixel (x, y) to get to its neighbor.
        for(const [dx, dy] of directions) {

            // Neighbor pixel coordinates (next in flood fill)
            // this const Is calculating the coordinates of the from the current pixel (x, y) to get to its neighbor.
            const neighborX = x + dx;
            const neighborY = y + dy;

            if(
                neighborX >= 0 && neighborX < canvasWidth && neighborY >= 0 && neighborY < canvasHeight 
            ) {
                const neighborIndex = neighborY * canvasWidth + neighborX;
                if (!visited[neighborIndex]) {

                    if (
                        isSimilarColor(pixels[neighborIndex], targetColor32Bits)
                    ) {
                        queue.push([neighborX, neighborY]);

                        visited[neighborIndex] = 1;

                    } else {
                        isEdge = true;
                    }
                }
            }
        } // For each neighbor: If it’s unvisited and similar, we add it to the queue.

        if(isEdge) {
            edgePixels.push(index);
        } // If it's different, it's likely an edge.
    }

    // ---------- SECONDARY FILL PASS ----------
    // fill unvisited pixels that are very close to visited ones and within tolerance
    for (let y = 0; y < canvasHeight; y++) {

        for (let x = 0; x < canvasWidth; x++) {

            const index = y * canvasWidth + x;
            if (visited[index]) continue; // already filled

            for (const [dx, dy] of directions) {
                const neighborX = x + dx;
                const neighborY = y + dy;

                if (
                    neighborX >= 0 && neighborY >= 0 && neighborX < canvasWidth && neighborY < canvasHeight
                ) {

                    const neighborIndex = neighborY * canvasWidth + neighborX;

                    if (
                        visited[neighborIndex] && isSimilarColor(pixels[index], targetColor32Bits)
                    ) {

                        pixels[index] = fillColor32Bits;
                        visited[index] = 1;
                        break;
                    }
                }
            }
        }
    } // i might in the future take this loop out
    /* Fills missed pixels that are similar but not directly reached by the BFS.
    Useful when the BFS skips thin gaps or noisy edges. 
    */

    // ---------- DILATION STEP ----------
    for (const index of edgePixels) {
        const x = index % canvasWidth;
        const y = Math.floor(index / canvasWidth);

        for (const [dx, dy] of directions) {

            const neighborX = x + dx;
            const neighborY = y + dy;
            
            if (
                neighborX >= 0 && neighborY >= 0 && neighborX < canvasWidth && neighborY < canvasHeight
            ) {
                const neighborIndex = neighborY * canvasWidth + neighborX;
                if (!visited[neighborIndex]) {

                    pixels[neighborIndex] = fillColor32Bits;

                    visited[neighborIndex] = 1; // mark it visited
                }
            }
        }
    } /* Looks around the edge pixels, and fills in small gaps around them.
    Makes the filled region appear more solid.
    */

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

    // Apply blur to edge pixels
    for (const index of edgePixels) {

        const originalColor = pixels[index];

        const blendedColor = blendColors(originalColor, fillColor32Bits, 0.5); // 0.3 = softness
        pixels[index] = blendedColor;
    }
    /*
    If factor = 0.0: 100% original color
    If factor = 1.0: 100% fill color
    If factor = 0.5: 50/50 mix
    If factor = 0.9: 90% fill color, very little original */

    // After modifying the imageData, this puts it back on the canvas to make changes visible.
    ctx.putImageData(imageData, 0, 0)
}