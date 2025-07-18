// UI for tools, colors, size, download

import { useDispatch } from "react-redux"
import {  setEraser, setPencil, setPencilColor, setScreenColor, setToolForm} from "../redux/slices/tools"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import SizeControl from "./buttonsToolbar/SizeControl"
// import UndoRedoReset from "./buttonsToolbar/UndoRedoReset"

type ToolbarProp = {
  drawingEngine: ReturnType<typeof import("../typescript/engine/drawingEngine").createDrawingEngine> | null,
}

const Toolbar = ({
  drawingEngine
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
          >Pencil</button>
          <button 
          className="bg-green-300 rounded-md"
          onClick={() => {
            dispatch(setEraser())
            dispatch(setToolForm('circle'))
          }}
          >Eraser</button>
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

        <div>
          <button
          onClick={() => {
            dispatch(setToolForm('line'))
            dispatch(setPencil())
          }}
          >Line /</button>
        </div>
        <div>
          <button
           onClick={() => {
            dispatch(setToolForm('square-shape'))
            dispatch(setPencil())
          }}
          >🟥</button>
        </div>
        <div>
          <button
          onClick={() => {
            dispatch(setToolForm('circle-shape'))
            dispatch(setPencil())
          }}
          >🟢</button>
        </div>
        <div>
          <button
          onClick={() => {
            dispatch(setToolForm('triangle-shape'))
            dispatch(setPencil())
          }}
          >🔺</button>
        </div>

        <div className="flex justify-around">
          <button
            className="rounded-md bg-green-300"
            onClick={() => {
              drawingEngine && drawingEngine.undo()
            }}
          >Undo</button>
          <button
            className="rounded-md bg-green-300"
            onClick={() => {
              drawingEngine && drawingEngine.redo()
            }}
          >Redo</button>
        </div>
        <div>
          <button
            onClick={() => {
              drawingEngine && drawingEngine.clear()
            }}
          >Reset</button>
        </div>

        {/* <UndoRedoReset/> */}

      </div>
    </>
  )
}

export default Toolbar