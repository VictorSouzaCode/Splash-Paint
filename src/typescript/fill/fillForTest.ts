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
  startY: number,
  startX: number,
  state: ToolState,
  tolerance: number = 40
) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const fillColor = hexConvertToRgb(state.pencilColor);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const startIdx = (startY * width + startX) * 4;
  const target = [
  data[startIdx],
  data[startIdx + 1],
  data[startIdx + 2],
  data[startIdx + 3]
];

  const sigma = tolerance / 2;

  // flood-fill queue
  const visited = new Uint8Array(width * height);
  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = (y * width + x);
    if (visited[idx]) continue;
    visited[idx] = 1;

    const di = idx * 4;
    const r = data[di], g = data[di + 1], b = data[di + 2];

    // Euclidean distance to target
    const a = data[di + 3];
const dist = Math.sqrt(
  (r - target[0]) ** 2 +
  (g - target[1]) ** 2 +
  (b - target[2]) ** 2 +
  (a - target[3]) ** 2 // include alpha channel
);

    // Similarity weight (soft edge)
const weight = Math.exp(-(dist * dist) / (2 * sigma * sigma));

if (weight > 0.0001) { // softer cutoff for halo removal
  data[di]     = r * (1 - weight) + fillColor[0] * weight;
  data[di + 1] = g * (1 - weight) + fillColor[1] * weight;
  data[di + 2] = b * (1 - weight) + fillColor[2] * weight;
  data[di + 3] = a * (1 - weight) + 255 * weight; // smooth alpha blend

  // Push neighbors
  if (x > 0) stack.push([x - 1, y]);
  if (x < width - 1) stack.push([x + 1, y]);
  if (y > 0) stack.push([x, y - 1]);
  if (y < height - 1) stack.push([x, y + 1]);
}
  }

  for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    if (!visited[idx]) continue;

    // Check if this pixel is at the edge of the filled area
    let isEdge = false;
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const nidx = ny * width + nx;
      if (!visited[nidx]) {
        isEdge = true;
        break;
      }
    }
    if (isEdge) {
      const di = idx * 4;
      // Blend with original color for feathering
      data[di]     = (data[di]     + fillColor[0]) / 2;
      data[di + 1] = (data[di + 1] + fillColor[1]) / 2;
      data[di + 2] = (data[di + 2] + fillColor[2]) / 2;
      data[di + 3] = 255;
    }
  }
}

for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const idx = y * width + x;
    if (!visited[idx]) {
      // Check if most neighbors are filled
      let filledNeighbors = 0;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]) {
        const nidx = (y + dy) * width + (x + dx);
        if (visited[nidx]) filledNeighbors++;
      }
      if (filledNeighbors >= 5) { // 5 or more neighbors are filled
        const di = idx * 4;
        // Fill/blend the dot pixel
        data[di]     = fillColor[0];
        data[di + 1] = fillColor[1];
        data[di + 2] = fillColor[2];
        data[di + 3] = 255;
      }
    }
  }
}

  ctx.putImageData(imgData, 0, 0);
};