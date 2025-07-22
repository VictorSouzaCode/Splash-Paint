import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { TbTriangle } from "react-icons/tb";
import { TbLine } from "react-icons/tb";


export const shapes = [
    {
        shapeName: 'line',
        ShapeIcon: TbLine
    },
    { 
        shapeName: 'square-shape',
        ShapeIcon: FaRegSquare
    },
    {
        shapeName: 'circle-shape',
        ShapeIcon: FaRegCircle
    },
    {
        shapeName: 'triangle-shape',
        ShapeIcon: TbTriangle
    }
]

export const previousSelectedShapes: string[] = []