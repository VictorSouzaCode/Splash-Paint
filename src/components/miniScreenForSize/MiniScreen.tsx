import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useRef } from "react";



const MiniScreen = () => {

    const state = useSelector((state:RootState) => state.tools)
    const followerRef = useRef<HTMLDivElement>(null);

  return (
    <div
    className="absolute bottom-[100%] min-w-[200px] h-[200px] rounded-md flex-center p-2"
    >
        <div className="w-full h-full rounded-md flex-center">
              <div
              ref={followerRef}
                  className="absolute pointer-events-none z-0"
                  style={{
                      borderRadius: state.toolForm === 'circle' || state.toolForm === 'line' || state.toolForm === 'circle-shape' ? '50%' : '0%',
                      borderWidth: state.tool === 'eraser' ? '2px' : '1px',
                      width: `${state.size}px`,
                      height: `${state.size}px`,
                      borderStyle: 'solid',
                      borderColor: state.tool === 'eraser' ? 'black' : state.pencilColor,
                      willChange: 'transform',
                  }}
              />
        </div>
    </div>
  )
}

export default MiniScreen