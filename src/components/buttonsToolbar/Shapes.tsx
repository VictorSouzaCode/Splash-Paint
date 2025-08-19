import { useDispatch, useSelector } from "react-redux"
import {  setToolForm, setShape,} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store";
import type { ToolForm } from "../../redux/slices/tools";
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { shapes} from "../../utils/shapeIcons";

const Shapes = () => {
    const dispatch = useDispatch()

    const { pencilColor, tool} = useSelector((state:RootState) => state.tools)

    const handleClick = (shapeName: ToolForm) => {
        dispatch(setToolForm(shapeName))
        dispatch(setShape())
        previousSelectedShapes.pop()
        previousSelectedShapes.push(shapeName)
    }

    const renderSelectedButton = (shapeName: ToolForm, Icon: React.ElementType) => {

        return (
            <div
            className="flex-center"
            key={shapeName}>
            <button
                className={`flex-center rounded-md`}
                style={{
                    color: tool === 'shape' ? pencilColor : '#000000'
                }}
                onClick={() => {
                    handleClick(shapeName)
                }}
            >
                <Icon />
            </button>
            </div>
        )
    }

    const currentShape = previousSelectedShapes[0] as ToolForm || 'line';

  return (
      <div className="w-[30px] h-[30px] relative rounded-md flex-center"
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