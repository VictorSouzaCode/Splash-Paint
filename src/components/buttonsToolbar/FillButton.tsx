
import { useDispatch, useSelector } from "react-redux"
import {  setFill } from "../../redux/slices/tools"
import type { RootState } from "../../redux/store";
import OpenConfigBarButton from "../configurationBar/OpenConfigBarButton";

import { BiSolidColorFill } from "react-icons/bi";




const FillButton = () => {
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.tools)

  const barIsActive = useSelector((state: RootState) => state.configBar.isActive)

  return (
    <div className="relative flex-center">
    {state.tool === 'fill' && !barIsActive && <OpenConfigBarButton />}
    <button
      className="text-3xl rounded-md flex-center"
      style={{
        color: state.tool === 'fill' ? state.pencilColor : '#000000',
        backgroundColor: state.tool === 'fill' ? '#e5e7eb' : 'transparent'
      }}
      onClick={() => {
        dispatch(setFill())
      }}
    >
      <BiSolidColorFill />
    </button>
    </div>
  )
}

export default FillButton