import type { Stroke } from "../utils/types"


type StrokesProps = {
    ctx: CanvasRenderingContext2D | null,
    stroke: Stroke
}

const drawstrokes = ({
    ctx,
    stroke
}:StrokesProps) => {

    if(!ctx) return

    if(stroke.toolForm === 'circle') {

        // drawing circle on click
            if(stroke.points.length === 1) {
                const radius = stroke.size / 2
                const circleX = stroke.points[0].x;
                const circleY = stroke.points[0].y;

                ctx.beginPath()
                ctx.arc(circleX, circleY, radius, 0, Math.PI * 100)
                ctx.fillStyle = stroke.color
                ctx.fill()
                ctx.closePath()
            }            

        // draw mouse movements
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        const points = stroke.points

            ctx.beginPath()
            if (points.length > 1) {
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
            }
            ctx.stroke();
        }

        if(stroke.toolForm === 'square') {

            const points = stroke.points

            ctx.lineCap = 'butt'
            ctx.lineJoin = 'miter'

            // draw square on click
            if (points.length === 1) {
                const points = stroke.points

                const positionX = points[0].x - stroke.size / 2
                const positionY = points[0].y - stroke.size / 2
                ctx.beginPath()
                ctx.fillStyle = stroke.color
                ctx.fillRect(positionX, positionY, stroke.size, stroke.size)
            }

            // draw mouse movements
            if(points.length > 1) {
                ctx.fillStyle = stroke.color
                for(let i = 1; i < points.length; i++){
                    const positionX = points[i].x - stroke.size / 2
                    const positionY = points[i].y - stroke.size / 2

                    ctx.fillRect(positionX, positionY, stroke.size, stroke.size)
                }
                ctx.closePath()
            }
        }
}

export default drawstrokes