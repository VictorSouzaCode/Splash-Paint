import StrokeFormSelector from "../buttonsToolbar/StrokeFormsSelector"
import ColorPallete from "../buttonsToolbar/ColorPallete"
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Shapes from "../buttonsToolbar/Shapes";
import OpenConfigBarButton from "../OpenConfigBarButton";

// next is shapes and fill tool to include in this toolbar


const ToolConfigurationBar = () => {

    const {tool} = useSelector((state:RootState) => state.tools)

  return (
    <div className="border1 h-[40px] w-full bg-neutral-200 absolute top-[1%] left-[50%] translate-y-[-100%] translate-x-[-50%] box-rounded flex-center">
        <OpenConfigBarButton/>
        <StrokeFormSelector/>
        <Shapes/>
        {tool === 'eraser' ? <div className="w-[35%]"></div> : <ColorPallete />}
    </div>
  )
}

export default ToolConfigurationBar