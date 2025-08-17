import StrokeFormSelector from "../buttonsToolbar/StrokeFormsSelector"
import ColorPallete from "../buttonsToolbar/ColorPallete"
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ShapeArray from "../buttonsToolbar/ShapeArray";


const ToolConfigurationBar = () => {

    const {tool} = useSelector((state:RootState) => state.tools)

    const modularGap = tool == 'pencil' ? `gap-x-1` : `gap-x-2`;

  return (
    <div className={`border1 min-h-[40px] h-fit w-full absolute top-[0%] left-[50%] translate-y-[-100%] translate-x-[-50%] box-rounded flex-center bg-white ${modularGap}`}>
        {tool === 'pencil' || tool === 'eraser' ? <StrokeFormSelector/> : <div></div>}
        {tool === 'shape' && <ShapeArray/>}
        {tool === 'eraser' ? <div className="md:w-[30%] lg:w-[45%]"></div> : <ColorPallete />}
    </div>
  )
}

export default ToolConfigurationBar