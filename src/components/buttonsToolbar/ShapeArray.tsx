import { shapes} from "../../utils/shapeIcons";
import type { ToolForm } from "../../redux/slices/tools";
import type { RootState } from "../../redux/store";
import { setToolForm, setShape } from "../../redux/slices/tools";
import { useDispatch, useSelector } from "react-redux"
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { setConfigBar } from "../../redux/slices/configToolBar";



const ShapeArray = () => {

    const dispatch = useDispatch()
    
    const selectedShape = useSelector((state:RootState) => state.tools.toolForm)
    const pencilColor = useSelector((state:RootState) => state.tools.pencilColor)

    const handleClick = (shapeName: ToolForm) => {
            dispatch(setToolForm(shapeName))
            dispatch(setShape())
            previousSelectedShapes.pop()
            previousSelectedShapes.push(shapeName)
    }
    
    const renderShapeButtons = (shapeName: ToolForm, Icon: React.ElementType, index: number) => {
        // const isFirst = index === 0;
        // const isLast = index === shapes.length - 1;
        // const borderClass = isFirst ? "rounded-t-md" : isLast ? "rounded-b-md" : "";

        const isSelected = shapeName === selectedShape

        return (
            <button
                key={index}
                className={`flex-center text-2xl w-[30px] h-[30px] rounded-md`}
                onClick={() => {
                    handleClick(shapeName)
                    dispatch(setConfigBar())
                }}
                style={{
                    color: isSelected ? pencilColor : '#000000',
                    backgroundColor: isSelected ? '#e5e7eb' : 'transparent'
                }}
            >
                <Icon />
            </button>
        )
    }

  return (
      <div
          className="h-fit flex-center flex-col rounded-md gap-y-4"
      >
          {shapes && shapes.map(({ shapeName, ShapeIcon }, i) => {
              return renderShapeButtons(shapeName as ToolForm, ShapeIcon, i)
          })}
      </div>
  )
}

export default ShapeArray