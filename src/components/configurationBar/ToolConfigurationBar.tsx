import StrokeFormSelector from "../buttonsToolbar/StrokeFormsSelector"
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ShapeArray from "../buttonsToolbar/ShapeArray";
import ColorPallete from "../buttonsToolbar/ColorPallete";

// i want that strokeformselector only shows on the side bar when pencil or eraser is selected
// i want shapes to appear only when shapes are selected


const ToolConfigurationBar = () => {

    const {tool} = useSelector((state:RootState) => state.tools)

  return (
    <div className={`border1 flex flex-col items-center justify-center absolute top-[50%] translate-y-[-50%] right-[10px] w-[40px] min-h-[40px] h-fit py-8 gap-8 box-rounded bg-white`}>
      {(tool === 'pencil' || tool === 'eraser') && <StrokeFormSelector/>}
      {tool === 'shape' && <ShapeArray/>}
      {(tool === 'fill' || tool === 'shape' || tool === 'pencil') && <ColorPallete/>}
    </div>
  )
}

export default ToolConfigurationBar