import { useDispatch, useSelector } from "react-redux"
import {  setPencil, setToolForm} from "../../redux/slices/tools"
import type { ComponentType, ElementType } from "react";
import type { RootState } from "../../redux/store";
import { previousSelectedShapes } from "../../utils/shapeIcons";
import { useState } from "react";
import { shapes} from "../../utils/shapeIcons";

// shapes
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { TbTriangle } from "react-icons/tb";
import { TbLine } from "react-icons/tb";
import type { IconType } from "react-icons";







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
      <div className="flex w-[40px] h-[40px] justify-around relative"
      onMouseLeave={() => {
                    setShowShapes(false)
                }}>
        {showShapes && <div 
        onMouseEnter={() => {
                    setShowShapes(true)
                }}
        className="absolute min-w-[40px] h-fit bg-gray-300 left-0 top-[-440%] flex flex-col items-center gap-y-4 rounded-md py-4">
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
        {/* {toolForm === 'square-shape' ? <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('square-shape'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
              onMouseEnter={() => {
                  setShowShapes(true)
              }}
              onMouseLeave={() => {
                  setShowShapes(false)
              }}
              ><FaRegSquare/></button> : toolForm === 'circle-shape' ? <button
                className={`hover:bg-gray-100 active:text-teal-300 hover:text-teal-400`}
                  onClick={() => {
                      dispatch(setToolForm('circle-shape'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
                  onMouseEnter={() => {
                    setShowShapes(true)
                  }}
                  onMouseLeave={() => {
                    setShowShapes(false)
                  }}
              ><FaRegCircle/></button> : toolForm === 'triangle-shape' ? <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('triangle-shape'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
                  onMouseEnter={() => {
                    setShowShapes(true)
                  }}
                  onMouseLeave={() => {
                    setShowShapes(false)
                  }}
              ><TbTriangle/></button> : <button
                className={`hover:bg-gray-100 active:text-teal-300 hover:text-teal-400`}
                  onClick={() => {
                      dispatch(setToolForm('line'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
                  onMouseEnter={() => {
                    setShowShapes(true)
                  }}
                  onMouseLeave={() => {
                    setShowShapes(false)
                  }}
              ><TbLine/></button>}
        {showShapes && <div 
        onMouseEnter={() => {
            setShowShapes((show) => !show)
        }}
        onMouseLeave={() => {
                    setShowShapes((show) => !show)
                  }}
        className="w-8 h-fit bg-slate-300 absolute top-[-400%] cursor-pointer rounded-md flex flex-col items-center justify-center">
            <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('square-shape'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
              ><FaRegSquare/></button>
              <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('circle-shape'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
              ><FaRegCircle/></button>
              <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('triangle-shape'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
              ><TbTriangle/></button>
              <button
                className={`hover:bg-gray-100 active:text-teal-300 hover:text-teal-400`}
                  onClick={() => {
                      dispatch(setToolForm('line'))
                      dispatch(setPencil())
                      setShowShapes(false)
                  }}
              ><TbLine/></button>
            </div>} */}


        {/* <button
                className={`hover:bg-gray-100 active:text-teal-300 hover:text-teal-400`}
                  onClick={() => {
                      dispatch(setToolForm('line'))
                      dispatch(setPencil())
                  }}
                  onMouseEnter={() => {
                    setShowShapes((show) => !show)
                  }}
                  onMouseLeave={() => {
                    setShowShapes((show) => !show)
                  }}
              ><TbLine/></button> */}
              {/* <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('square-shape'))
                      dispatch(setPencil())
                  }}
              ><FaRegSquare/></button>
              <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('circle-shape'))
                      dispatch(setPencil())
                  }}
              ><FaRegCircle/></button>
              <button
              className="hover:bg-gray-100 active:text-teal-300 hover:text-teal-400"
                  onClick={() => {
                      dispatch(setToolForm('triangle-shape'))
                      dispatch(setPencil())
                  }}
              ><TbTriangle/></button> */}
       </div>
  )
}

export default Shapes