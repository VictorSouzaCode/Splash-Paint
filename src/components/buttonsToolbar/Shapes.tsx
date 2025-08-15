import { useDispatch, useSelector } from "react-redux"
import {  setPencil, setToolForm, setShape} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store";
import type { ToolForm } from "../../redux/slices/tools";
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { useState } from "react";
import { shapes} from "../../utils/shapeIcons";
import OpenConfigBarButton from "../OpenConfigBarButton";

// change the hover effect so i doenst show on hover instead only when clicked so it combines with the color pallete function

const Shapes = () => {
    const dispatch = useDispatch()

    const { pencilColor, toolForm, tool} = useSelector((state:RootState) => state.tools)
    const barIsActive = useSelector((state: RootState) => state.configBar.isActive)

    const [showShapes, setShowShapes] = useState<boolean>(false)

    const handleClick = (shapeName: ToolForm) => {
        dispatch(setToolForm(shapeName))
        dispatch(setShape())
        previousSelectedShapes.pop()
        previousSelectedShapes.push(shapeName)
        setShowShapes((show) => !show)
    }

    const renderSelectedButton = (shapeName: ToolForm, Icon: React.ElementType) => {
        const isSelected = toolForm === shapeName

        return (
            <>
            {isSelected && !barIsActive && <OpenConfigBarButton/>}
            <button
                key={shapeName}
                className={`w-10 h-10 grid place-content-center rounded-md`}
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
            </>
        )
    }

    const renderShapeButtons = (shapeName: ToolForm, Icon: React.ElementType, index: number) => {
        const isFirst = index === 0;
        const isLast = index === shapes.length - 1;
        const borderClass = isFirst ? "rounded-t-md" : isLast ? "rounded-b-md" : "";

        return (
            <button
                key={index}
                className={`w-10 h-10 grid place-content-center hover:bg-gray-100 ${borderClass}`}
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

          {shapes && shapes.filter((shape) => shape.shapeName === currentShape).map(({ shapeName, ShapeIcon }) => (
              renderSelectedButton(shapeName as ToolForm, ShapeIcon)
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
                      return renderShapeButtons(shapeName as ToolForm, ShapeIcon, i)
                  })}
              </div>
          }
      </div>
  )
}

export default Shapes