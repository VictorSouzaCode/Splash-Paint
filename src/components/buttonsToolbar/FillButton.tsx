
import { useDispatch } from "react-redux"
import {  setFill } from "../../redux/slices/tools"

// fill Icon
import { BsPaintBucket } from "react-icons/bs";

const FillButton = () => {
  const dispatch = useDispatch()

  return (
    <button
      className="text-3xl"
      onClick={() => {
        dispatch(setFill())
      }}
    >
      <BsPaintBucket />
    </button>
  )
}

export default FillButton