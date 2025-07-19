import { useDispatch } from "react-redux"
import { useRef } from "react"
import { increasePointerSize, decreasePointerSize} from "../../redux/slices/tools"


import { FiPlus } from "react-icons/fi";
import { HiMiniMinusSmall } from "react-icons/hi2";



const SizeControl = () => {
    const dispatch = useDispatch()
    const intervalRef = useRef<number | null>(null);

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
      <div className="flex justify-center items-center gap-x-4 h-8 rounded-xl mt-2 text-2xl">
          <button
              className="h-full rounded-md grid place-content-center border1"
              onMouseDown={(e) => {
                  handleMouseDownPlus(e)
              }}
              onContextMenu={(e) => {
                  preventContextMenu(e)
              }}
              onMouseUp={handleMouseUp}
          >
              <FiPlus />
          </button>

          {/* <h1 className="text-lg font-semibold">
              size
          </h1> */}

          <button
              className="bg- h-full w-8 rounded-md border1 grid place-content-center"
              onMouseDown={(e) => {
                  handleMouseDownMinus(e)
              }}
              onContextMenu={(e) => {
                  preventContextMenu(e)
              }}
              onMouseUp={handleMouseUp}
          >
              <HiMiniMinusSmall />
          </button>
      </div>
  )
}

export default SizeControl