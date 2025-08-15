import SizeControl from "./buttonsToolbar/SizeControl"
import Download from "./buttonsToolbar/Download"
import Shapes from "./buttonsToolbar/Shapes"
import PencilEraser from "./buttonsToolbar/PencilEraser"
import FillButton from "./buttonsToolbar/FillButton"
import UndoRedoDelete from "./buttonsToolbar/UndoRedoDelete"
import { useState } from "react"

// hideShow icons
import { PiCaretDoubleDownBold } from "react-icons/pi";
import { PiCaretDoubleUpBold } from "react-icons/pi";



const Toolbar = () => {

  const [hide, setHide] = useState<boolean>(false)

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
    <div className="z-50 flex-center bottom-position min-h-[50px] h-fit main-container-width rounded-md gap-x-4 border1 bg-white">
        
        <div className="h-full text-2xl flex-center flex-wrap gap-x-4">
          <SizeControl />

          <PencilEraser />

          <Shapes />

          <FillButton/>

          <UndoRedoDelete/>

          <Download/>

          <button className="text-lg opacity-70"
            onClick={() => {
              setHide((show) => !show)
            }}
          >
            <PiCaretDoubleDownBold />
          </button>
        </div>
      </div>
      }
    
    </>
  )
}

export default Toolbar