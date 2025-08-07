import type { ToolState } from "../../redux/slices/tools";


// Problems that i have, i dont know How to solve yet

// if the stroke is too thin, the fill tool will scape to the outside area filling all the canvas 

const hexConvertToRgb = (hex:string):[number, number, number, number] => {
    hex = hex.replace(/^#/, '')

    // Handle shorthand hex (#000) => #000000
    if(hex.length === 3) {
        hex = hex.split('').map(character => character + character).join('')
    }

    const R = parseInt(hex.substring(0, 2), 16);
    const G = parseInt(hex.substring(2, 4), 16);
    const B = parseInt(hex.substring(4, 6), 16);
    const A = hex.length >= 8 ? parseInt(hex.substring(6, 8), 16) : 255;

    return [R, G, B, A]
}


export const fillTool = (

    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    state: ToolState,

) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = new Uint32Array(imageData.data.buffer)


    const fillColorRgb = hexConvertToRgb(state.pencilColor)

    const fillColor32B = (fillColorRgb[3] << 24) |
        (fillColorRgb[2] << 16) |
        (fillColorRgb[1] << 8) |
        fillColorRgb[0];

    const clickedPixel = startY + canvasHeight + startX;
    const targetColor32B = pixels[clickedPixel]


    const visited = new Uint8Array(canvasWidth * canvasHeight);

    const queue: [number, number][] = [[startX, startY]];

    visited[clickedPixel] = 1; // mark first pixel as visited

    const edgePixels: number[] = []; // store the boundary pixels to fill targetColor gaps later.

    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // 4-connected // // Up, down, left, right
        [-1, -1], [-1, 1], [1, -1], [1, 1], // // Diagonals
    ];

    const COLOR_TOLERANCE = 100;

    const colorDifference = (color1: number, color2: number) => {
        const r1 = color1 & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = (color1 >> 16) & 0xff;
        const a1 = (color1 >> 24) & 0xff;

        const r2 = color2 & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = (color2 >> 16) & 0xff;
        const a2 = (color2 >> 24) & 0xff;

        const dr = r1 - r2;
        const dg = g1 - g2;
        const db = b1 - b2;
        const da = a1 - a2;

        return dr * dr + dg * dg + db * db + da * da;
    };

    const isSimilarColor = (color1:number, color2:number) => {
        return colorDifference(color1, color2) <= COLOR_TOLERANCE;
    }

    // ------- Main Flood Fill Algorithm ------------
    while(queue.length > 0){
        const [x, y] = queue.shift()!;
        const index = y * canvasWidth + x;

        if(!isSimilarColor(pixels[index], targetColor32B)) continue;

        pixels[index] = fillColor32B

        let isEdge = false;
        for(const [direcX, direcY] of directions) {
            const neighborX = x + direcX;
            const neighborY = y + direcY;

            if(neighborX >= 0 && neighborX < canvasWidth && neighborY >= 0 && neighborY < canvasHeight ) {
                const neighborIndex = neighborY * canvasWidth + neighborX;

                if(!visited[neighborIndex]) {
                    if(isSimilarColor(pixels[neighborIndex], targetColor32B)) {
                        queue.push([neighborX, neighborY]);
                        visited[neighborIndex] = 1;
                    }
                } else {
                    isEdge = true;
                }
            }
        }

        if(isEdge) edgePixels.push(index);
    }

    // ------ DILATION STEP ------
    // fill unvisited edges pixels
    for (const index of edgePixels) {
        const x = index % canvasWidth;
        const y = Math.floor(index / canvasWidth);

        for (const [dx, dy] of directions) {
            const neighborX = x + dx;
            const neighborY = y + dy;

            if (neighborX >= 0 && neighborY >= 0 && neighborX < canvasWidth && neighborY < canvasHeight) {
                const neighborIndex = neighborY * canvasWidth + neighborX;
                if (!visited[neighborIndex]) {
                    pixels[neighborIndex] = fillColor32B
                    visited[neighborIndex] = 1;
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0)

}