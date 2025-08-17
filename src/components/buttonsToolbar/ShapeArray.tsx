import { shapes} from "../../utils/shapeIcons";
import type { ToolForm } from "../../redux/slices/tools";
import { setToolForm, setShape } from "../../redux/slices/tools"
import { useDispatch } from "react-redux"
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { setConfigBar } from "../../redux/slices/configToolBar";



const ShapeArray = () => {

    const dispatch = useDispatch()
    

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

        return (
            <button
                key={index}
                className={`flex-center text-2xl`}
                onClick={() => {
                    handleClick(shapeName)
                    dispatch(setConfigBar())
                }}
            >
                <Icon />
            </button>
        )
    }

  return (
      <div
          className="h-fit flex-center rounded-md gap-x-2"
      >
          {shapes && shapes.map(({ shapeName, ShapeIcon }, i) => {
              return renderShapeButtons(shapeName as ToolForm, ShapeIcon, i)
          })}
      </div>
  )
}

export default ShapeArray