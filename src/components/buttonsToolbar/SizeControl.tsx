import { useDispatch } from "react-redux"
import { useRef, useState } from "react"
import { increasePointerSize, decreasePointerSize, setIsResizing} from "../../redux/slices/tools"
import MiniScreen from "../miniScreenForSize/MiniScreen";

import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";


const SizeControl = () => {
    const dispatch = useDispatch()
    const intervalRef = useRef<number | null>(null);

    const [showMiniScreen, setShowMiniScreen] = useState<boolean>(false)

    const preventContextMenu = (e:React.MouseEvent) => {
      e.preventDefault()
    }

    const handleMouseDownPlus = (e:React.MouseEvent) => {
      if (e.button === 2) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      dispatch(increasePointerSize())
      dispatch(setIsResizing(true))
      intervalRef.current = setInterval(() => {
        dispatch(increasePointerSize())
      }, 50)
    }

    const handleMouseDownMinus = (e:React.MouseEvent) => {
      if (e.button === 2) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      dispatch(decreasePointerSize())
      dispatch(setIsResizing(true))
      intervalRef.current = setInterval(() => {
        dispatch(decreasePointerSize())
      }, 50)
    }

    const handleMouseUp = () => {
      if(intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

  return (
      <div className="flex-center gap-x-1 text-2xl"
      onMouseEnter={() => {
        dispatch(setIsResizing(true))
        setShowMiniScreen(true)
      }}
      onMouseLeave={() => {
        dispatch(setIsResizing(false))
        setShowMiniScreen(false)
      }}
      >
        {showMiniScreen && <MiniScreen/>}
          <button
              className="active:text-gray-600"
              onMouseDown={(e) => {
                  handleMouseDownPlus(e)
              }}
              onContextMenu={(e) => {
                  preventContextMenu(e)
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
          >
              <FaPlusSquare />
          </button>

          <button
              className="active:text-gray-600"
              onMouseDown={(e) => {
                  handleMouseDownMinus(e)
              }}
              onContextMenu={(e) => {
                  preventContextMenu(e)
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
          >
              <FaMinusSquare />
          </button>
      </div>
  )
}

export default SizeControl