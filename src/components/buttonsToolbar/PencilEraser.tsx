import { useDispatch } from "react-redux"
import {  setEraser, setPencil, setToolForm} from "../../redux/slices/tools"

// pencil eraser
import { PiEraserFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";

// pencil form
import { TbCircleDashed } from "react-icons/tb";
import { LuSquareDashed } from "react-icons/lu";


const PencilEraser = () => {
  const dispatch = useDispatch()

  return (
    <div className="flex justify-center h-fit">
      <button
        className="rounded-md text-3xl hover:text-amber-500 hover:bg-gray-100 focus:bg-gray-100 focus:text-amber-500"
        onClick={() => {
          dispatch(setPencil())
          dispatch(setToolForm('circle'))
        }}
      ><RiPencilFill />
      </button>
      <button
        className="rounded-md text-3xl hover:text-red-500 hover:bg-gray-100 focus:text-red-500 focus:bg-gray-100"
        onClick={() => {
          dispatch(setEraser())
          dispatch(setToolForm('circle'))
        }}
      ><PiEraserFill /></button>

      <div className="flex justify-around rounded-md">
        <button
          className="hover:bg-gray-100 rounded-md"
          style={{
            color: '#000000'
          }}
          onClick={() => {
            dispatch(setToolForm('circle'))
            dispatch(setPencil())
          }}
        ><TbCircleDashed /></button>
        <button
          className="hover:bg-gray-100 rounded-md"
          style={{
            color: '#000000'
          }}
          onClick={() => {
            dispatch(setToolForm('square'))
            dispatch(setPencil())
          }}
        ><LuSquareDashed /></button>
      </div>
    </div>
  )
}

export default PencilEraser