import { useDispatch, useSelector } from "react-redux"
import { setPencilColor, setScreenColor} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store"
import { basicColorsOptions } from "../../utils/colorPalleteData"



const ColorPallete = () => {
    const dispatch = useDispatch()
    const {pencilColor, tool, screenColor} = useSelector((state:RootState) => state.tools)

  return (
      <div className="flex items-center">
          <input
              type="color"
              value={pencilColor}
              className="rounded-full w-6"
              onChange={(e) => {
                  dispatch(setPencilColor(e.target.value))
              }}
              disabled={tool === 'eraser'}
          />
          {basicColorsOptions.map((colors) => (
              <button
                  className="w-6 h-6 border1 rounded-full"
                  key={colors}
                  style={{
                      backgroundColor: colors
                  }}
                  onClick={() => {
                      dispatch(setPencilColor(colors))
                  }}
              ></button>
          ))}
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
  )
}

export default ColorPallete