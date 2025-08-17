import SizeControl from "./buttonsToolbar/SizeControl"
import Download from "./buttonsToolbar/Download"
import Shapes from "./buttonsToolbar/Shapes"
import PencilEraser from "./buttonsToolbar/PencilEraser"
import FillButton from "./buttonsToolbar/FillButton"
import UndoRedoDelete from "./buttonsToolbar/UndoRedoDelete"
import ToggleToolBarButton from "./buttonsToolbar/ToggleToolBarButton"
import type { RootState } from "../redux/store"
import { useSelector } from "react-redux"



const Toolbar = () => {

  const hide = useSelector((state: RootState) => state.toggleToolBar.isShowing)

  return (
    <>
    {hide && <ToggleToolBarButton/>}

    {!hide && 
    <div className="z-50 flex-center bottom-position min-h-[50px] h-fit main-container-width rounded-md border1 bg-white">
        
        <div className="h-full text-2xl flex-center flex-wrap gap-x-4">
          <SizeControl />

          <PencilEraser />

          <Shapes />

          <FillButton/>

          <UndoRedoDelete/>

          <Download/>

          <ToggleToolBarButton/>

        </div>
      </div>
      }
    
    </>
  )
}

export default Toolbar