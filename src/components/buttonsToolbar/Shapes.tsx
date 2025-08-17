import { useDispatch, useSelector } from "react-redux"
import {  setToolForm, setShape,} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store";
import type { ToolForm } from "../../redux/slices/tools";
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { shapes} from "../../utils/shapeIcons";
import OpenConfigBarButton from "../configurationBar/OpenConfigBarButton";

const Shapes = () => {
    const dispatch = useDispatch()

    const { pencilColor, tool} = useSelector((state:RootState) => state.tools)
    const barIsActive = useSelector((state: RootState) => state.configBar.isActive)

    const handleClick = (shapeName: ToolForm) => {
        dispatch(setToolForm(shapeName))
        dispatch(setShape())
        previousSelectedShapes.pop()
        previousSelectedShapes.push(shapeName)
    }

    const renderSelectedButton = (shapeName: ToolForm, Icon: React.ElementType) => {

        return (
            <>
            {tool === 'shape' && !barIsActive && <OpenConfigBarButton/>}
            <button
                key={shapeName}
                className={`w-10 h-10 grid place-content-center rounded-md`}
                style={{
                    color: tool === 'shape' ? pencilColor : '#000000'
                }}
                onClick={() => {
                    handleClick(shapeName)
                }}
            >
                <Icon />
            </button>
            </>
        )
    }

    const currentShape = previousSelectedShapes[0] as ToolForm || 'line';

  return (
      <div className="w-[30px] h-[30px] relative rounded-md flex justify-center items-center"
          style={{
              backgroundColor: tool !== 'shape' ? 'transparent' : '#e5e7eb'
          }}
      >

          {shapes && shapes.filter((shape) => shape.shapeName === currentShape).map(({ shapeName, ShapeIcon }) => (
              renderSelectedButton(shapeName as ToolForm, ShapeIcon)
          )) 
          }
      </div>
  )
}

export default Shapes