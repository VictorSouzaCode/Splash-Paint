import type { Point, Stroke } from "../utils/types"


type drawingProps = {
    ctxPreview: CanvasRenderingContext2D,
    stroke: Stroke
    points: Point[]
    canvasPreview: HTMLCanvasElement,
}

const previewStrokeHandler = ({
    ctxPreview, 
    stroke, 
    points,
    canvasPreview
}:drawingProps) => {

    const color = stroke.color;
    const size = stroke.size

    if (stroke.toolForm === 'circle') {

        if (points.length === 1) {

            const radius = stroke.size / 2
            const circleX = stroke.points[0].x
            const circleY = stroke.points[0].y
            
            ctxPreview.beginPath()
            ctxPreview.arc(circleX, circleY, radius, 0, Math.PI * 100)
            ctxPreview.fillStyle = stroke.color
            ctxPreview.fill()
            ctxPreview.restore()
        }

        if(points.length > 1) {
            ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
            ctxPreview.strokeStyle = color;
            ctxPreview.lineWidth = size;
            ctxPreview.lineJoin = 'round';
            ctxPreview.lineCap = 'round';
            ctxPreview.beginPath();
            ctxPreview.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctxPreview.lineTo(points[i].x, points[i].y);
            }
            ctxPreview.stroke();
        }
    }

    if(stroke.toolForm === 'square') {

        if (points.length === 1) {
            const points = stroke.points

            const positionX = (points[0].x) - stroke.size / 2
            const positionY = (points[0].y) - stroke.size / 2
            ctxPreview.beginPath()
            ctxPreview.fillStyle = stroke.color
            ctxPreview.fillRect(positionX, positionY, stroke.size, stroke.size)
        }

        if(points.length > 1) {

            ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
            ctxPreview.fillStyle = stroke.color
            for (let i = 1; i < points.length; i++) {
                const positionX = points[i].x - stroke.size / 2
                const positionY = points[i].y - stroke.size / 2

                ctxPreview.fillRect(positionX, positionY, stroke.size, stroke.size)
            }
            ctxPreview.closePath()
        }
    }
}


export default previewStrokeHandler