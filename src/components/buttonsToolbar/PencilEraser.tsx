import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store";
import type { ToolForm } from "../../redux/slices/tools";
import {  setEraser, setPencil, setToolForm} from "../../redux/slices/tools"
import { toolsArray, strokeForm } from "../../utils/toolsData";


const PencilEraser = () => {
  const dispatch = useDispatch()

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

  const renderToolsButton = (toolName: string, Icon: React.ElementType) => {

    const isSelected = tool === toolName;

    const currentTool = isSelected && toolName

    const iconColor = currentTool === 'pencil' && !['line', 'square-shape', 'circle-shape','triangle-shape'].includes(toolForm) ? pencilColor : currentTool === 'eraser' ? '#ef4444' : '#000000';

    const bgColor = currentTool && !['line', 'square-shape', 'circle-shape','triangle-shape'].includes(toolForm) ? '#e5e7eb' : 'transparent'

    return (
      <button 
      key={toolName}
      className={`rounded-md text-3xl flex justify-center items-center`}
      style={{
        color: iconColor,
        backgroundColor: bgColor
      }}
      onClick={() => {
        handleToolsClick(toolName)
      }}
      >
        <Icon/>
      </button>
    )
  }

  const handleFormClick = (strokeForm:ToolForm) => {

    dispatch(setToolForm(strokeForm))
    if (tool === 'eraser') {
      dispatch(setEraser())
    }
    if (tool === 'pencil') {
      dispatch(setPencil())
    }
  }

  const renderStrokeFormsButton = (strokeForm:ToolForm, Icon:React.ElementType) => {
    const isSelected = toolForm === strokeForm
    const currentForm = isSelected && strokeForm

    const iconColor = tool === 'pencil' && currentForm ? pencilColor : '#000000'
    const bgColor = currentForm ? '#e5e7eb' : 'transparent';

    return (
      <button
      key={strokeForm}
      className="w-[30px] h-full rounded-md flex justify-center items-center"
      style={{
        color: iconColor,
        backgroundColor: bgColor
      }}
      onClick={() => {
        handleFormClick(strokeForm)
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

      <div className="flex justify-center items-center rounded-md text-base">
        {strokeForm && strokeForm.map(({name, Icon}) => (
          renderStrokeFormsButton(name, Icon)
        ))}
      </div>
    </div>
  )
}

export default PencilEraser