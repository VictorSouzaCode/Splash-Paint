import { useDispatch, useSelector } from "react-redux"
import { setPencilColor} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store"
import { basicColorsOptions } from "../../utils/colorPalleteData"
import { setConfigBar } from "../../redux/slices/configToolBar";
import multiColorbackground from '../../assets/rainbow.jpg'

const ColorPallete = () => {
    const dispatch = useDispatch()
    const {pencilColor, tool} = useSelector((state:RootState) => state.tools)

  return (
    <>
    <div
        className="flex flex-wrap justify-around items-center h-fit gap-y-2 gap-x-2 px-2"
        >
            <div className="relative w-5 h-5 rounded-full transition-all duration-200"
              style={{
                border: '1px solid gray'
              }}>
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundImage: `url(${multiColorbackground})`, backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <input
                type="color"
                value={pencilColor}
                onChange={(e) => dispatch(setPencilColor(e.target.value))}
                disabled={tool === 'eraser'}
                className={`absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed`}
              />
            </div>
          {basicColorsOptions.map((colors) => (
              <button
                  className="w-5 h-5 rounded-full gap-4"
                  key={colors}
                  style={{
                      border: '1px solid gray',                      
                      backgroundColor: colors
                  }}
                  onClick={() => {
                      dispatch(setPencilColor(colors))
                      dispatch(setConfigBar())
                  }}
              ></button>
          ))}
          </div>
    </>
  )
}

export default ColorPallete