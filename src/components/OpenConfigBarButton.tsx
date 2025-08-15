import { setConfigBar } from "../redux/slices/configToolBar";
import { useDispatch } from "react-redux"
import { RiArrowDownWideFill } from "react-icons/ri";
import { RiArrowUpWideLine } from "react-icons/ri";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";



const OpenConfigBarButton = () => {

    const dispatch = useDispatch()
    const barIsActive = useSelector((state: RootState) => state.configBar.isActive)

    if(barIsActive) {

        return (
            <button
            className="opacity-30"
            key={1}
            onClick={() => {
                dispatch(setConfigBar())
            }}
        >
            <RiArrowDownWideFill />
        </button>
        )
    } else {

        return (
            <button
                onClick={() => {
                    dispatch(setConfigBar())
                }}
                className="absolute bottom-9 opacity-20"
                key={1}>
                <RiArrowUpWideLine />
            </button>
      )
    }
}

export default OpenConfigBarButton