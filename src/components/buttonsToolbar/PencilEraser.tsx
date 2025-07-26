import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store";
import {  setEraser, setPencil, setToolForm} from "../../redux/slices/tools"
import { useState } from "react";
import { toolsArray, strokeForm } from "../../utils/toolsData";

// pencil eraser
import { PiEraserFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";

// pencil form
import { MdCircle } from "react-icons/md";
import { MdSquare } from "react-icons/md";




const PencilEraser = () => {
  const dispatch = useDispatch()

  const [showForms, setShowForms] = useState<boolean>(false)
  const [showFormsEraser, setShowFormsEraser] = useState<boolean>(false)

  const { tool, toolForm, pencilColor} = useSelector((state: RootState) => state.tools)

  const handleToolsClick = (toolName: string) => {
    if(toolName === 'pencil') {
      dispatch(setPencil())
    }
    if(toolName === 'eraser') {
      dispatch(setEraser())
    }
    if (toolForm !== 'circle' && toolForm !== 'square') {
      dispatch(setToolForm('circle'))
    }
  }

  const handleFormClick = (strokeForm:string) => {
    if(strokeForm === 'circle') {
      dispatch(setToolForm('circle'))
    }
    if(strokeForm === 'square') {
      dispatch(setToolForm('square'))
    }
  }

  const renderToolsButton = (toolName: string, Icon: React.ElementType) => {

    return (
      <button 
      key={toolName}
      className="rounded-md text-3xl flex justify-center items-center"
      onClick={() => {
        handleToolsClick(toolName)
      }}
      >
        <Icon/>
      </button>
    )
  }

  const renderStrokeFormsButton = (name:string, Icon:React.ElementType) => {

    return (
      <button
      key={name}
      onClick={() => {
        handleFormClick(name)
      }}
      >
        <Icon/>
      </button>
    )
  }

  return (
    <div className="flex justify-center h-fit relative gap-x-2">
      {toolsArray && toolsArray.map(({name, Icon}) => (
        renderToolsButton(name, Icon)
      ))}
      <button
        className="rounded-md text-3xl flex justify-center items-center"
        style={{
          color: tool === 'pencil' && toolForm === 'circle' || toolForm === 'square' && tool !== 'eraser' ? pencilColor : 'black',
          backgroundColor: tool === 'pencil' && toolForm === 'circle' || toolForm === 'square' && tool !== 'eraser' ? '#e5e7eb' : 'transparent',
        }}
        onClick={() => {
          dispatch(setPencil())
          if(toolForm !== 'circle' && toolForm !== 'square') {
            dispatch(setToolForm('circle'))
          }
        }}
      ><RiPencilFill />
      </button>

      <button
        className="rounded-md text-3xl flex justify-center items-center"
        style={{
          color: tool === 'eraser' && toolForm === 'circle' || toolForm === 'square' && tool !== 'pencil' ? '#ef4444' : 'black',
          backgroundColor: tool === 'eraser' && toolForm === 'circle' || toolForm === 'square' && tool !== 'pencil' ? '#e5e7eb' : 'transparent'
        }}
        onClick={() => {
          dispatch(setEraser())
          if(toolForm !== 'circle' && toolForm !== 'square') {
            dispatch(setToolForm('circle'))
          }
        }}
      ><PiEraserFill />
      </button>

      <div className="flex justify-center items-center rounded-md text-base">
        {strokeForm && strokeForm.map(({name, Icon}) => (
          renderStrokeFormsButton(name, Icon)
        ))}
        <button
          className="w-[30px] h-full rounded-md flex justify-center items-center"
          style={{
            color: tool === 'pencil' && toolForm === 'circle' ? pencilColor : '#000000',
            backgroundColor: toolForm === 'circle' ? '#e5e7eb' : 'transparent'
          }}
          onClick={() => {
            dispatch(setToolForm('circle'))
            if(tool === 'eraser') {
              dispatch(setEraser())
            }
            if(tool === 'pencil') {
              dispatch(setPencil())
            }
          }}
        ><MdCircle />
        </button>
        <button
          className="w-[30px] h-full rounded-md flex justify-center items-center"
          style={{
            color: tool === 'pencil' && toolForm === 'square' ? pencilColor : '#000000',
            backgroundColor: toolForm === 'square' ? '#e5e7eb' : 'transparent'
          }}
          onClick={() => {
            dispatch(setToolForm('square'))
            if(tool === 'eraser') {
              dispatch(setEraser())
            }
            if(tool === 'pencil') {
              dispatch(setPencil())
            }
          }}
        ><MdSquare />
        </button>
      </div>
    </div>
  )
}

export default PencilEraser