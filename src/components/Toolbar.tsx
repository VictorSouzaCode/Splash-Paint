// UI for tools, colors, size, download

import { useDispatch } from "react-redux"
import { increasePointerSize, decreasePointerSize, setEraser, setPencil, setPencilColor, setScreenColor} from "../redux/slices/tools"
// import { useSelector } from "react-redux"
// import type { RootState } from "../redux/store"
// import { useEffect, useRef } from "react"
import { useHoldAction } from "../hooks/useHoldAction"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"


// i need to add a button that changes the background color


const Toolbar = () => {
    const dispatch = useDispatch()

    const {pencilColor, tool, screenColor} = useSelector((state:RootState) => state.tools)

    const increaseHandlers = useHoldAction(() => dispatch(increasePointerSize()))
    const decreaseHandlers = useHoldAction(() => dispatch(decreasePointerSize()))

  return (
    <>
    <div className="border1 z-10 w-32 min-h-[300px] h-full max-h-[500px] absolute top-[50%] translate-y-[-50%] left-2 rounded-xl px-2 flex flex-col gap-4">
        
        <div className="flex justify-center items-center gap-x-4 h-8 rounded-xl mt-2">
          <button 
          className="text-3xl h-full w-8 rounded-md bg-green-400 grid place-content-center"
          {...increaseHandlers}
          >
            +
          </button>

            <h1 className="text-lg font-semibold">
              size
            </h1>

          <button 
          className="text-5xl bg- h-full w-8 rounded-md bg-green-400 grid place-content-center"
          {...decreaseHandlers}
          >
            -
          </button>
        </div>

        <div className="flex justify-center gap-4 h-8">
          <button 
          className="bg-green-300 rounded-md"
          onClick={() => {
            dispatch(setPencil())
          }}
          >Pencil</button>
          <button 
          className="bg-green-300 rounded-md"
          onClick={() => {
            dispatch(setEraser())
          }}
          >Eraser</button>
        </div>

        <div>
          <input 
          type="color" 
          value={pencilColor}
          onChange={(e) => {
            dispatch(setPencilColor(e.target.value))
          }}
          disabled={tool === 'eraser'}
          />
        </div>

        <div>
          <p>background color</p>
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
    </>
  )
}

export default Toolbar