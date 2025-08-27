import { useDispatch, useSelector } from "react-redux"
import { setPencilColor} from "../../redux/slices/tools"
import type { RootState } from "../../redux/store"
import { basicColorsOptions } from "../../utils/colorPalleteData"
import multiColorbackground from '../../assets/rainbow.jpg'
import { useRef } from "react"


const ColorPallete = () => {
    const dispatch = useDispatch()
    const {pencilColor, tool} = useSelector((state:RootState) => state.tools)

    let customColorValueRef = useRef<string>('#ffffff')

  return (
    <>
    <div
        className="flex-center flex-col flex-wrap h-fit gap-y-4"
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
                onChange={(e) => {
                  dispatch(setPencilColor(e.target.value))
                  customColorValueRef.current = e.target.value
                }}
                disabled={tool === 'eraser'}
                className={`absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed`}
              />
            </div>
          {basicColorsOptions.map((colors) => (
              <button
                  className="w-5 h-5 rounded-full"
                  key={colors}
                  style={{
                      border: '1px solid gray',                      
                      backgroundColor: colors
                  }}
                  onClick={() => {
                      dispatch(setPencilColor(colors))
                  }}
              ></button>
          ))}
        <div
          className="w-5 h-5 rounded-full"
          onClick={() => {
            dispatch(setPencilColor(customColorValueRef.current))
          }}
          style={{
            backgroundColor: `${customColorValueRef.current}`,
            border: '1px solid gray'
          }}
        ></div>
          </div>
    </>
  )
}

export default ColorPallete