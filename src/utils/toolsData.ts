
import { PiEraserFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";

import { MdCircle } from "react-icons/md";
import { MdSquare } from "react-icons/md";

import type { Tools, ToolForm } from "../redux/slices/tools";


type ToolsType = {
    name: Tools
    Icon: React.ElementType
}[]

type StrokeType = {
    name: ToolForm,
    Icon: React.ElementType
}[]

export const toolsArray: ToolsType = [
    {
        name: 'pencil',
        Icon: RiPencilFill
    },
    {
        name: 'eraser',
        Icon: PiEraserFill
    }
]

export const strokeForm:StrokeType = [
    {
        name: 'circle',
        Icon: MdCircle
    },
    {
        name: 'square',
        Icon: MdSquare
    }
]
