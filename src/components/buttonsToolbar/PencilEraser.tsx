import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store";
import {  setEraser, setPencil, setToolForm} from "../../redux/slices/tools"
import { setConfigBar } from "../../redux/slices/configToolBar";
import { toolsArray } from "../../utils/toolsData";
import ToolConfigurationBar from "../configurationBar/ToolConfigurationBar";

import { RiArrowUpWideLine } from "react-icons/ri";

import OpenConfigBarButton from "../OpenConfigBarButton";




const PencilEraser = () => {
  const dispatch = useDispatch()

  const { tool, toolForm, pencilColor} = useSelector((state: RootState) => state.tools)

  const barIsActive = useSelector((state: RootState) => state.configBar.isActive)

  const handleToolsClick = (toolName: string) => {
    if(toolName === 'pencil') {
      dispatch(setPencil())
    } else {
      dispatch(setEraser())
    }
    if (toolForm !== 'circle' && toolForm !== 'square') {
      dispatch(setToolForm('circle'))
    }
  }

  const renderToolsButton = (toolName: string, Icon: React.ElementType) => {

    const isSelected = tool === toolName;

    const currentTool = isSelected && toolName;

    const iconColor = currentTool === 'pencil' && !['line', 'square-shape', 'circle-shape','triangle-shape'].includes(toolForm) ? pencilColor : currentTool === 'eraser' ? '#ef4444' : '#000000';

    const bgColor = currentTool && !['line', 'square-shape', 'circle-shape','triangle-shape'].includes(toolForm) ? '#e5e7eb' : 'transparent';

    return (
      <>
      <div className="flex-col flex-center">
      {isSelected && !barIsActive && <OpenConfigBarButton/>}
      <button 
      key={toolName}
      className={`flex-center rounded-md text-3xl`}
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
      </div>
      </>
    )
  }

  return (
    <>
    {barIsActive  && <ToolConfigurationBar/>}
    <div className="flex justify-center relative gap-x-2">
      {toolsArray && toolsArray.map(({name, Icon}) => (
        renderToolsButton(name, Icon)
      ))}
      
    </div>
    </>
  )
}

export default PencilEraser