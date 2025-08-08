
import { useDispatch, useSelector } from "react-redux"
import {  setFill } from "../../redux/slices/tools"
import type { RootState } from "../../redux/store";

// fill Icon
import { BsPaintBucket } from "react-icons/bs";


const FillButton = () => {
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.tools)

  return (
    <button
      className="text-3xl"
      style={{
        color: state.tool === 'fill' ? state.pencilColor : '#000000'
      }}
      onClick={() => {
        dispatch(setFill())
      }}
    >
      <BsPaintBucket />
    </button>
  )
}

export default FillButton