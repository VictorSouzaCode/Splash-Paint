import { useDispatch, useSelector } from "react-redux"
import {  setPencil, setToolForm} from "../../redux/slices/tools"
import type { ElementType } from "react";
import type { RootState } from "../../redux/store";
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { useState } from "react";
import { shapes} from "../../utils/shapeIcons";





const Shapes = () => {
    const dispatch = useDispatch()
    const { pencilColor, toolForm} = useSelector((state:RootState) => state.tools)

    const [showShapes, setShowShapes] = useState<boolean>(false)

    const shapeElements = (shape:{
        shapeName: string,
        ShapeIcon: ElementType,
    }, key: number) => {

        const Icon = shape.ShapeIcon

        if (shape.shapeName === 'line') {

            return <button
            className="w-10 h-10 grid place-content-center rounded-t-md"
            style={{
                color: toolForm === 'line' ? pencilColor : '#000000'
            }}
                onClick={() => {
                    dispatch(setToolForm('line'))
                    dispatch(setPencil())
                    if (previousSelectedShapes.length > 0) {
                        previousSelectedShapes.pop()
                    }
                    if(previousSelectedShapes.length === 0) {
                        previousSelectedShapes.push(shape.shapeName)
                      }
                      setShowShapes(false)
                }}
                onMouseEnter={() => {
                    setShowShapes(true)
                }}
                key={key}><Icon /></button>
        }
        if(shape.shapeName === 'square-shape') {
            return <button
            className="w-10 h-10 grid place-content-center"
            style={{
                color: toolForm === 'square-shape' ? pencilColor : '#000000'
            }}
                onClick={() => {
                    dispatch(setToolForm('square-shape'))
                    dispatch(setPencil())
                    if (previousSelectedShapes.length > 0) {
                        previousSelectedShapes.pop()
                    }
                    if (previousSelectedShapes.length === 0) {
                        previousSelectedShapes.push(shape.shapeName)
                    }
                    setShowShapes(false)
                }}
                onMouseEnter={() => {
                    setShowShapes(true)
                }}
            key={key}><Icon/></button>
        }
        if(shape.shapeName === 'circle-shape') {
            return <button 
            className="w-10 h-10 grid place-content-center"
            style={{
                color: toolForm === 'circle-shape' ? pencilColor : '#000000'
            }}
                onClick={() => {
                    dispatch(setToolForm('circle-shape'))
                    dispatch(setPencil())
                    if (previousSelectedShapes.length > 0) {
                        previousSelectedShapes.pop()
                    }
                    if (previousSelectedShapes.length === 0) {
                        previousSelectedShapes.push(shape.shapeName)
                    }
                    setShowShapes(false)
                }}
                onMouseEnter={() => {
                    setShowShapes(true)
                }}
            key={key}><Icon/></button>
        }
        if(shape.shapeName === 'triangle-shape') {
            return <button 
            className="w-10 h-10 grid place-content-center rounded-b-md"
            style={{
                color: toolForm === 'triangle-shape' ? pencilColor : '#000000'
            }}
                onClick={() => {
                    dispatch(setToolForm('triangle-shape'))
                    dispatch(setPencil())
                    if (previousSelectedShapes.length > 0) {
                        previousSelectedShapes.pop()
                    }
                    if (previousSelectedShapes.length === 0) {
                        previousSelectedShapes.push(shape.shapeName)
                    }
                    setShowShapes(false)
                }}
                onMouseEnter={() => {
                    setShowShapes(true)
                }}
            key={key}><Icon/></button>
        }
    }

  return (
      <div className="w-[30px] h-[30px] relative rounded-md flex justify-center items-center"
      style={{
        backgroundColor: toolForm !== 'circle' && toolForm !== 'square' ? '#e5e7eb' : 'transparent'
      }}
      onMouseLeave={() => {
                    setShowShapes(false)
                }}>
        {showShapes && <div 
        onMouseEnter={() => {
                    setShowShapes(true)
                }}
        className="absolute min-w-[40px] h-fit bg-gray-200 left-[50%] translate-x-[-50%] top-[-550%] flex flex-col items-center rounded-md">
            {shapes && shapes.map((shape, i) => {
                return shapeElements(shape, i)
            })}
        </div>}

        {shapes && shapes.map((shape, i) => {
            if(previousSelectedShapes.length === 0 || previousSelectedShapes[0] === 'line') {

                if(shape.shapeName === 'line') {
                   return shapeElements(shape, i)
                }
            }
            if(previousSelectedShapes[0] === 'square-shape') {
                if(shape.shapeName === 'square-shape') {
                   return shapeElements(shape, i)
                }
            }
            if(previousSelectedShapes[0] === 'circle-shape') {
                if(shape.shapeName === 'circle-shape') {
                   return shapeElements(shape, i)
                }
            }
            if(previousSelectedShapes[0] === 'triangle-shape') {
                if(shape.shapeName === 'triangle-shape') {
                   return shapeElements(shape, i)
                }
            }
        })}
       </div>
  )
}

export default Shapes