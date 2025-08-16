import StrokeFormSelector from "../buttonsToolbar/StrokeFormsSelector"
import ColorPallete from "../buttonsToolbar/ColorPallete"
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ShapeArray from "../buttonsToolbar/ShapeArray";
import OpenConfigBarButton from "./OpenConfigBarButton";


const ToolConfigurationBar = () => {

    const {tool} = useSelector((state:RootState) => state.tools)

  return (
    <div className="border1 min-h-[40px] h-fit w-full absolute top-[0%] left-[50%] translate-y-[-100%] translate-x-[-50%] box-rounded flex-center bg-white">
        <OpenConfigBarButton/>
        {tool === 'pencil' || tool === 'eraser' ? <StrokeFormSelector/> : <div></div>}
        {tool === 'shape' && <ShapeArray/>}
        {tool === 'eraser' ? <div className="md:w-[35%] lg:w-[45%]"></div> : <ColorPallete />}
    </div>
  )
}

export default ToolConfigurationBar