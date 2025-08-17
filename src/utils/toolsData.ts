
import { PiEraserFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";

import { MdCircle } from "react-icons/md";
import { MdSquare } from "react-icons/md";

import type { Tools, ToolForm } from "../redux/slices/tools";


type ToolsType = {
    name: Tools
    Icon: React.ElementType,
    keyNumber: number
}[]

type StrokeType = {
    name: ToolForm,
    Icon: React.ElementType,
    keyNumber: number
}[]

export const toolsArray: ToolsType = [
    {
        name: 'pencil',
        Icon: RiPencilFill,
        keyNumber: 1
    },
    {
        name: 'eraser',
        Icon: PiEraserFill,
        keyNumber: 2
    }
]

export const strokeForm:StrokeType = [
    {
        name: 'circle',
        Icon: MdCircle,
        keyNumber: 1
    },
    {
        name: 'square',
        Icon: MdSquare,
        keyNumber: 2
    }
]
