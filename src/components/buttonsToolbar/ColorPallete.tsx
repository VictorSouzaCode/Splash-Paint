import { useDispatch, useSelector } from "react-redux"
import { setPencilColor, setScreenColor} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store"
import { basicColorsOptions } from "../../utils/colorPalleteData"
import { useState } from "react"

// i can make a square the reflects the color that the user choose

const ColorPallete = () => {
    const dispatch = useDispatch()
    const {pencilColor, tool, screenColor} = useSelector((state:RootState) => state.tools)

    const [showColors, setShowColors] = useState(false)



  return (
    <>
      <div 
      className="flex items-center w-16 h-6 rounded-md relative border1"
      onMouseEnter={() => {
        setShowColors(true)
      }}
      onMouseLeave={() => {
        setShowColors(false)
      }}
      >
        {showColors && 
        <div className="absolute flex flex-wrap justify-around items-center w-[160px] h-fit bg-gray-200 top-[-350%] left-1/2 -translate-x-1/2 rounded-md gap-y-2 gap-x-2 py-3 px-2">
            <input
            type="color"
            value={pencilColor}
            className="rounded-full w-6 h-6 cursor-pointer"
            onChange={(e) => {
                dispatch(setPencilColor(e.target.value))
            }}
            disabled={tool === 'eraser'}
            />
          {basicColorsOptions.map((colors) => (
              <button
                  className="w-5 h-5 rounded-full gap-4"
                  key={colors}
                  style={{
                      border: '1px solid gray',                      backgroundColor: colors
                  }}
                  onClick={() => {
                      dispatch(setPencilColor(colors))
                  }}
              ></button>
          ))}
          </div>
        }
          
          {/* <div className="">
              <p>BG Color</p>
              <input
                  type="color"
                  value={screenColor}
                  onChange={(e) => {
                      dispatch(setScreenColor(e.target.value))
                  }}
                  disabled={tool === 'eraser'}
              />
          </div> */}
      </div>
    </>
  )
}

export default ColorPallete