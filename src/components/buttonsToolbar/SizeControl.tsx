import { useDispatch } from "react-redux"
import { useRef } from "react"
import { increasePointerSize, decreasePointerSize, setIsResizing} from "../../redux/slices/tools"


import { FaPlus } from "react-icons/fa6";
import { TiMinus } from "react-icons/ti";



// Change the increase and decrease, to every time i click on it the circle that follows the mouse needs to appear in the middle of the screen or slight above the tool bar

// change increase and decrease icons to arrows one up and one down

// add key board commads to increase and decrease



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
      <div className="flex justify-center items-center rounded-xl text-2xl gap-2"
      onMouseEnter={() => {
        dispatch(setIsResizing(true))
      }}
      onMouseLeave={() => {
        dispatch(setIsResizing(false))
      }}
      >
          <button
              className="rounded-md grid place-content-center h-[30px] w-[30px] active:text-gray-600"
              onMouseDown={(e) => {
                  handleMouseDownPlus(e)
              }}
              onContextMenu={(e) => {
                  preventContextMenu(e)
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
          >
              <FaPlus />
          </button>

          <button
              className="rounded-md grid place-content-center h-[30px] w-[30px] active:text-gray-600"
              onMouseDown={(e) => {
                  handleMouseDownMinus(e)
              }}
              onContextMenu={(e) => {
                  preventContextMenu(e)
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
          >
              <TiMinus/>
          </button>
      </div>
  )
}

export default SizeControl