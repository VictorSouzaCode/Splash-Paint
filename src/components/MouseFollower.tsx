import type { RootState } from "../redux/store"
import { useSelector } from "react-redux"
import { usePointerFollower } from "../hooks/usePointerFollower"

const MouseFollower = () => {
  const state = useSelector((state: RootState) => state.tools)

  const { followerRef } = usePointerFollower()
  
  return (
    <div
    ref={followerRef}
    className="absolute pointer-events-none z-0"
    style={{
      borderRadius: state.toolForm === 'circle' || state.toolForm === 'line' || state.toolForm === 'circle-shape' ? '50%' : '0%',
      width: state.size,
      height: state.size,
      borderWidth: state.tool === 'eraser' ? '2px' : '1px',
      borderStyle: 'solid',
      borderColor: state.tool === 'eraser' ? 'black' : state.pencilColor,
      willChange: 'transform',
    }}
    />
  )
}

export default MouseFollower