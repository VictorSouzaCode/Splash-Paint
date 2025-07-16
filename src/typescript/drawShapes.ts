import type { Stroke, Point } from "../utils/types"

type StrokesProps = {
    ctx: CanvasRenderingContext2D,
    stroke: Stroke
    shapeStartPoint: Point | null,
    shapeEndingPoint: Point | null
}


const drawShapes = ({
    ctx,
    stroke,
    shapeStartPoint,
    shapeEndingPoint
}:StrokesProps) => {

    if(stroke.toolForm === 'line' && stroke.points.length === 2) {
        const points = stroke.points
        const startX = stroke.points[0].x
        const startY = stroke.points[0].y

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let i = 1; i < points.length; i++) {
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

        ctx.lineCap = 'square'
        ctx.lineJoin = 'miter'
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

        ctx.lineCap = 'butt'
        ctx.lineJoin = 'miter'
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

        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size;
        ctx.stroke();
    }
}

export default drawShapes