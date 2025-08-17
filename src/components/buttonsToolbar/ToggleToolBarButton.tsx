import { PiCaretDoubleDownBold } from "react-icons/pi";
import { PiCaretDoubleUpBold } from "react-icons/pi";
import { useDispatch } from "react-redux"
import { toggleToolBar } from "../../redux/slices/ToggleMainToolBar"
import type { RootState } from "../../redux/store"
import { useSelector } from "react-redux"


const ToggleToolBarButton = () => {

    const dispatch = useDispatch()
    const hide = useSelector((state: RootState) => state.toggleToolBar.isShowing)

    if(hide) {
        return (
            <button 
                className="text-lg z-50 absolute top-[100%] left-[50%] translate-y-[-100%] translate-x-[-50%] opacity-25"
                onClick={() => {
                  dispatch(toggleToolBar())
                }}
                >
                  <PiCaretDoubleUpBold />
                </button>
        )
    }

    if (!hide) {
        return (
            <button className="text-lg opacity-70"
                onClick={() => {
                    dispatch(toggleToolBar())
                }}
            >
                <PiCaretDoubleDownBold />
            </button>
        )
    }
}

export default ToggleToolBarButton