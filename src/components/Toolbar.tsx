// UI for tools, colors, size, download

// i need to make the plus sign increase the circle size
// i need to make the minus sign decrease the circle size

// so i need to make a function on redux to make that happen
import { useDispatch } from "react-redux"
import { setPointerSize } from "../redux/slices/tools"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

const Toolbar = () => {
  const dispatch = useDispatch()

  const state = useSelector((state: RootState) => state.tools)

  return (
    <>
    <div className="border1 z-10 w-32 min-h-[300px] h-full max-h-[500px] absolute top-[50%] translate-y-[-50%] left-2 rounded-xl px-2">
        
        <div className="flex justify-center items-center gap-x-4 h-8 rounded-xl mt-2">
          <button 
          className="text-3xl h-full w-8 rounded-md bg-green-400 grid place-content-center"
          onMouseDown={() => {
            dispatch(setPointerSize(state.size + 1))
          }}
          >
            +
          </button>
            <h1 className="text-lg font-semibold">
              size
            </h1>
          <button className="text-5xl bg- h-full w-8 rounded-md bg-green-400 grid place-content-center"
          onClick={() => {
            dispatch(setPointerSize(state.size - 1))
          }}>
            -
          </button>
        </div>

      </div>
    </>
  )
}

export default Toolbar