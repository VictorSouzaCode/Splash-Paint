// UI for tools, colors, size, download

import { useDispatch } from "react-redux"
import {  setEraser, setPencil, setPencilColor, setScreenColor, setToolForm} from "../redux/slices/tools"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import SizeControl from "./buttonsToolbar/SizeControl"
import Download from "./buttonsToolbar/Download"
import Shapes from "./buttonsToolbar/Shapes"
// import UndoRedoReset from "./buttonsToolbar/UndoRedoReset"

// undo redo reset
import { PiArrowUUpRightFill } from "react-icons/pi";
import { PiArrowUUpLeftFill } from "react-icons/pi";

// reset
import { BiReset } from "react-icons/bi";
import { MdResetTv } from "react-icons/md";


// pencil eraser
import { PiEraserFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";








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
    <div className="border1 z-50 w-32 min-h-[300px] h-fit absolute top-[50%] translate-y-[-50%] left-2 rounded-xl px-2 flex flex-col gap-4">
        
        <SizeControl/>

        <div className="flex justify-center gap-4 h-8">
          <button 
          className="bg-green-300 rounded-md"
          onClick={() => {
            dispatch(setPencil())
            dispatch(setToolForm('circle'))
          }}
          ><RiPencilFill/></button>
          <button 
          className="bg-green-300 rounded-md"
          onClick={() => {
            dispatch(setEraser())
            dispatch(setToolForm('circle'))
          }}
          ><PiEraserFill/></button>
        </div>

        <div className="border1">
          <p>Tool Color</p>
          <input 
          type="color" 
          value={pencilColor}
          onChange={(e) => {
            dispatch(setPencilColor(e.target.value))
          }}
          disabled={tool === 'eraser'}
          />
        </div>

        <div className="border1">
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

        <div className="border1 flex justify-around">
          <button className="w-8 h-8 rounded-full"
          style={{
            backgroundColor: pencilColor
          }}
          onClick={() => {
            dispatch(setToolForm('circle'))
            dispatch(setPencil())
          }}
          ></button>
          <button className="w-8 h-8"
          style={{
            backgroundColor: pencilColor
          }}
          onClick={() => {
            dispatch(setToolForm('square'))
            dispatch(setPencil())
          }}
          ></button>
        </div>

        <Shapes/>

        <div className="flex justify-around">
          <button
            className="rounded-md bg-green-300"
            onClick={() => {
              drawingEngine && drawingEngine.undo()
            }}
          ><PiArrowUUpLeftFill/></button>
          <button
            className="rounded-md bg-green-300"
            onClick={() => {
              drawingEngine && drawingEngine.redo()
            }}
          ><PiArrowUUpRightFill/></button>
        </div>
        <div>
          <button
            onClick={() => {
              drawingEngine && drawingEngine.clear()
            }}
          ><MdResetTv /></button>
        </div>

        <Download/>

        {/* <UndoRedoReset/> */}

      </div>
    </>
  )
}

export default Toolbar