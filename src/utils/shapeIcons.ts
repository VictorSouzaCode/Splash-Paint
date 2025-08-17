import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { TbTriangle } from "react-icons/tb";
import { TbLine } from "react-icons/tb";


export const shapes = [
    {
        shapeName: 'circle-shape',
        ShapeIcon: FaRegCircle
    },
    { 
        shapeName: 'square-shape',
        ShapeIcon: FaRegSquare
    },
    {
        shapeName: 'triangle-shape',
        ShapeIcon: TbTriangle
    },
    {
        shapeName: 'line',
        ShapeIcon: TbLine
    }
]

export const previousSelectedShapes: string[] = []