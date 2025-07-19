import { useDispatch } from "react-redux"
import {  setPencil, setToolForm} from "../../redux/slices/tools"

// shapes
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { TbTriangle } from "react-icons/tb";
import { HiOutlineArrowLongUp } from "react-icons/hi2";
import { TbLine } from "react-icons/tb";
import { HiOutlineSlash } from "react-icons/hi2";
import { PiLineSegmentThin } from "react-icons/pi";
import { PiLineSegment } from "react-icons/pi";








const Shapes = () => {
    const dispatch = useDispatch()
  return (
      <div className="flex justify-around">
          <div className="">
              <button
                  onClick={() => {
                      dispatch(setToolForm('line'))
                      dispatch(setPencil())
                  }}
              ><TbLine/></button>
          </div>
          <div className="">
              <button
                  onClick={() => {
                      dispatch(setToolForm('square-shape'))
                      dispatch(setPencil())
                  }}
              ><FaRegSquare/></button>
          </div>
          <div className="">
              <button
                  onClick={() => {
                      dispatch(setToolForm('circle-shape'))
                      dispatch(setPencil())
                  }}
              ><FaRegCircle/></button>
          </div>
          <div className="">
              <button
                  onClick={() => {
                      dispatch(setToolForm('triangle-shape'))
                      dispatch(setPencil())
                  }}
              ><TbTriangle/></button>
          </div>
       </div>
  )
}

export default Shapes