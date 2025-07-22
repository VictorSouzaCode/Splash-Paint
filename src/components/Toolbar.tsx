// UI for tools, colors, size, download

import SizeControl from "./buttonsToolbar/SizeControl"
import Download from "./buttonsToolbar/Download"
import Shapes from "./buttonsToolbar/Shapes"
import PencilEraser from "./buttonsToolbar/PencilEraser"
import ColorPallete from "./buttonsToolbar/ColorPallete"

// undo redo reset
import { PiArrowLeftFill } from "react-icons/pi";
import { PiArrowRightFill } from "react-icons/pi";
import { TfiTrash } from "react-icons/tfi";
















// Next step will be make the ui good looking and intuitive

type ToolbarProp = {
  drawingEngine: ReturnType<typeof import("../typescript/engine/drawingEngine").createDrawingEngine> | null,
  download: () => void
}

const Toolbar = ({
  drawingEngine,
}:ToolbarProp) => {

  return (
    <>
    <div className="z-50 min-w-32 w-full h-[60px] absolute top-[100%] left-[50%] translate-y-[-100%] translate-x-[-50%] rounded-xl flex px-2 justify-center gap-4 border1 items-center bg-white">
        
        <div className="h-fit text-2xl flex gap-4 items-center">
          <SizeControl />

          <PencilEraser />

          <Shapes />

          <div className="flex justify-around">
            <button
              className="rounded-md hover:bg-gray-100 active:text-sky-300 hover:text-sky-400"
              onClick={() => {
                drawingEngine && drawingEngine.undo()
              }}
            ><PiArrowLeftFill /></button>
            <button
              className="rounded-md hover:bg-gray-100 active:text-sky-300 hover:text-sky-400"
              onClick={() => {
                drawingEngine && drawingEngine.redo()
              }}
            ><PiArrowRightFill /></button>
          </div>
        </div>

        <ColorPallete/>

        <div className="flex flex-row-reverse gap-y-4 justify-around text-2xl">
          <button
          className="hover:bg-gray-100 rounded-md"
            onClick={() => {
              drawingEngine && drawingEngine.clear()
            }}
          ><TfiTrash /></button>

        <Download/>
        </div>

      </div>
    </>
  )
}

export default Toolbar