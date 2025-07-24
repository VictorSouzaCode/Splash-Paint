import { useDispatch, useSelector } from "react-redux"
import {  setPencil, setToolForm} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store";
import type { ToolForm } from "../../redux/slices/tools";
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { useState } from "react";
import { shapes} from "../../utils/shapeIcons";
// import type { ElementType } from "react";





const Shapes = () => {
    const dispatch = useDispatch()

    const { pencilColor, toolForm} = useSelector((state:RootState) => state.tools)

    const [showShapes, setShowShapes] = useState<boolean>(false)

    const handleClick = (shapeName: ToolForm) => {
        dispatch(setToolForm(shapeName))
        dispatch(setPencil())
        previousSelectedShapes.pop()
        previousSelectedShapes.push(shapeName)
        setShowShapes(false)
    }

    const renderShapeButton = (shapeName: ToolForm, Icon: React.ElementType, index: number) => {
        const isSelected = toolForm === shapeName
        const isFirst = index === 0;
        const isLast = index === shapes.length - 1;
        const borderClass = isFirst ? "rounded-t-md" : isLast ? "rounded-b-md" : "";

        return (
            <button
                key={shapeName}
                className={`w-10 h-10 grid place-content-center ${borderClass}`}
                style={{
                    color: isSelected ? pencilColor : '#000000'
                }}
                onClick={() => {
                    handleClick(shapeName)
                }}
                onMouseEnter={() => setShowShapes(true)}
            >
                <Icon />
            </button>
        )
    }

    const currentShape = previousSelectedShapes[0] as ToolForm || 'line';

  return (
      <div className="w-[30px] h-[30px] relative rounded-md flex justify-center items-center"
          style={{
              backgroundColor: ['circle', 'square'].includes(toolForm) ? 'transparent' : '#e5e7eb'
          }}
          onMouseLeave={() => {
              setShowShapes(false)
          }}
      >

          {shapes && shapes.filter((shape) => shape.shapeName === currentShape).map(({ shapeName, ShapeIcon }, i) => (
              renderShapeButton(shapeName as ToolForm, ShapeIcon, i)
          ))
          }

          {showShapes &&
              <div
                  onMouseEnter={() => {
                      setShowShapes(true)
                  }}
                  className="absolute min-w-[40px] h-fit bg-gray-200 left-1/2 -translate-x-1/2 top-[-550%] flex flex-col items-center rounded-md"
                >
                  {shapes && shapes.map(({ shapeName, ShapeIcon }, i) => {
                      return renderShapeButton(shapeName as ToolForm, ShapeIcon, i)
                  })}
              </div>
          }
      </div>
  )
}

export default Shapes