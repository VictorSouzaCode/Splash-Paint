import SizeControl from "./buttonsToolbar/SizeControl"
import Download from "./buttonsToolbar/Download"
import Shapes from "./buttonsToolbar/Shapes"
import PencilEraser from "./buttonsToolbar/PencilEraser"
import ColorPallete from "./buttonsToolbar/ColorPallete"
import FillButton from "./buttonsToolbar/FillButton"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { getEngine } from "../utils/drawingEgineSingleton"

// undo redo reset
import { PiArrowLeftFill } from "react-icons/pi";
import { PiArrowRightFill } from "react-icons/pi";
import { TfiTrash } from "react-icons/tfi";

// hideShow icons
import { PiCaretDoubleDownBold } from "react-icons/pi";
import { PiCaretDoubleUpBold } from "react-icons/pi";



const Toolbar = () => {

  const [hide, setHide] = useState<boolean>(false)

  const state = useSelector((state: RootState) => state.tools)

  let engine: any;

  useEffect(() => {
    try {
      engine = getEngine();
    } catch (err) {
      console.warn("Drawing engine not ready:", err);
      return;
    }
  }, [state])

  return (
    <>
    {
    hide && 
    <button 
    className="text-lg z-50 absolute top-[100%] left-[50%] translate-y-[-100%] translate-x-[-50%] opacity-25"
    onClick={() => {
      setHide((show) => !show)
    }}
    >
      <PiCaretDoubleUpBold />
    </button>
    }

    {!hide && 
    <div className="z-50 min-w-32 w-full h-[60px] absolute top-[100%] left-[50%] translate-y-[-100%] translate-x-[-50%] rounded-xl flex px-2 justify-center gap-x-4 border1 items-center bg-white">
        
        <div className="h-fit text-2xl flex items-center gap-x-4">
          <SizeControl />

          <PencilEraser />

          <Shapes />

          <ColorPallete/>

          <FillButton/>


          <div className="flex justify-around">
            <button
              className="rounded-md active:text-gray-400 w-[30px] h-[30px] grid place-content-center"
              onClick={() => {
                engine && engine.undo()
              }}
            ><PiArrowLeftFill /></button>
            <button
              className="rounded-md active:text-gray-400 w-8 h-[30px] grid place-content-center"
              onClick={() => {
                engine && engine.redo()
              }}
            ><PiArrowRightFill /></button>
          </div>

        </div>

        <div className="flex flex-row-reverse gap-x-3 justify-around text-2xl">
          <button
          className="active:text-gray-400 rounded-md"
            onClick={() => {
              engine && engine.clear()
            }}
          ><TfiTrash /></button>

        <Download/>
        </div>

        <button className="text-lg opacity-70"
      onClick={() => {
        setHide((show) => !show)
      }}
      >
        <PiCaretDoubleDownBold/>
      </button>

      </div>
      }
    
    </>
  )
}

export default Toolbar