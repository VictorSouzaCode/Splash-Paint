import { useDispatch, useSelector } from "react-redux"
import {  setEraser, setPencil, setToolForm} from "../../redux/slices/tools"
import type { ToolForm } from "../../redux/slices/tools";
import type { RootState } from "../../redux/store";
import { strokeForm } from "../../utils/toolsData";
import { setConfigBar } from "../../redux/slices/configToolBar";



const StrokeFormSelector = () => {

    const dispatch = useDispatch()
    const { tool, toolForm, pencilColor} = useSelector((state: RootState) => state.tools)

    const handleFormClick = (strokeForm:ToolForm) => {
    
        dispatch(setToolForm(strokeForm))
        if (tool === 'pencil') {
          dispatch(setPencil())
        } else {
          dispatch(setEraser())
        }
      }

  const render = (strokeForm:ToolForm, Icon:React.ElementType) => {
    const isSelected = toolForm === strokeForm
    const currentForm = isSelected && strokeForm

    const iconColor = tool === 'pencil' && currentForm ? pencilColor : '#000000';

    const bgColor = currentForm ? '#e5e7eb' : 'transparent';

    return (
      <button
        key={strokeForm}
        className="button-tools-box flex-center h-full"
        style={{
          color: iconColor,
          backgroundColor: bgColor
        }}
        onClick={() => {
          handleFormClick(strokeForm)
          dispatch(setConfigBar())
        }}
      >
        <Icon />
      </button>
    )
  }

  return (
    <div className="flex-center rounded-md text-base h-[30px]">
      {strokeForm && strokeForm.map(({ name, Icon }) => (
        render(name, Icon)
      ))}
    </div>
  )

}

export default StrokeFormSelector