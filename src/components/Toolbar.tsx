// UI for tools, colors, size, download

import { useDispatch } from "react-redux"
import {  setEraser, setPencil, setPencilColor, setScreenColor, setToolForm} from "../redux/slices/tools"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import SizeControl from "./buttonsToolbar/SizeControl"
import Download from "./buttonsToolbar/Download"
import Shapes from "./buttonsToolbar/Shapes"
import { basicColorsOptions } from "../utils/colorPalleteData"
// import UndoRedoReset from "./buttonsToolbar/UndoRedoReset"

// undo redo reset
import { PiArrowUUpRightFill } from "react-icons/pi";
import { PiArrowUUpLeftFill } from "react-icons/pi";
import { TfiTrash } from "react-icons/tfi";

// pencil eraser
import { PiEraserFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";

// pencil form
import { TbCircleDashed } from "react-icons/tb";
import { LuSquareDashed } from "react-icons/lu";
















// Next step will be make the ui good looking and intuitive

type ToolbarProp = {
  drawingEngine: ReturnType<typeof import("../typescript/engine/drawingEngine").createDrawingEngine> | null,
  download: () => void
}

const Toolbar = ({
  drawingEngine,
}:ToolbarProp) => {
    const dispatch = useDispatch()

    const {pencilColor, tool, screenColor} = useSelector((state:RootState) => state.tools)

  return (
    <>
    <div className="z-50 min-w-32 w-full h-[100px] absolute top-[100%] left-[50%] translate-y-[-100%] translate-x-[-50%] rounded-xl flex px-2 justify-center gap-4 border1 items-center">
        
        <div className="border1 h-fit text-2xl flex gap-4 items-center">
        <SizeControl/>

        <div className="flex justify-center h-fit">
            <button
              className="rounded-md text-3xl"
              onClick={() => {
                dispatch(setPencil())
                dispatch(setToolForm('circle'))
              }}
            ><RiPencilFill />
            </button>
            <button
              className="rounded-md text-3xl"
              onClick={() => {
                dispatch(setEraser())
                dispatch(setToolForm('circle'))
              }}
            ><PiEraserFill /></button>

            <div className="flex justify-around rounded-md">
              <button
                style={{
                  color: '#000000'
                }}
                onClick={() => {
                  dispatch(setToolForm('circle'))
                  dispatch(setPencil())
                }}
              ><TbCircleDashed /></button>
              <button
                style={{
                  color: '#000000'
                }}
                onClick={() => {
                  dispatch(setToolForm('square'))
                  dispatch(setPencil())
                }}
              ><LuSquareDashed /></button>
            </div>
        </div>

          <Shapes />

          <div className="flex justify-around">
            <button
              className="rounded-md bg-green-300"
              onClick={() => {
                drawingEngine && drawingEngine.undo()
              }}
            ><PiArrowUUpLeftFill /></button>
            <button
              className="rounded-md bg-green-300"
              onClick={() => {
                drawingEngine && drawingEngine.redo()
              }}
            ><PiArrowUUpRightFill /></button>
          </div>
        </div>

        <div className="border1 flex flex-wrap">
          <input
              type="color"
              value={pencilColor}
              className="rounded-full w-6"
              onChange={(e) => {
                  dispatch(setPencilColor(e.target.value))
              }}
              disabled={tool === 'eraser'}
          />
          {basicColorsOptions.map((colors) => (
              <button
                  className="w-4 h-4 border1 rounded-full"
                  key={colors}
                  style={{
                      backgroundColor: colors
                  }}
                  onClick={() => {
                      dispatch(setPencilColor(colors))
                  }}
              ></button>
          ))}
          <div className="">
            <p>BG Color</p>
            <input
              type="color"
              value={screenColor}
              onChange={(e) => {
                dispatch(setScreenColor(e.target.value))
              }}
              disabled={tool === 'eraser'}
            />
          </div>
      </div>

        <div className="flex justify-around border1">
        <div>
          <button
            onClick={() => {
              drawingEngine && drawingEngine.clear()
            }}
          ><TfiTrash /></button>
        </div>

        <Download/>
        </div>

      </div>
    </>
  )
}

export default Toolbar