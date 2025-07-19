import { useDispatch } from "react-redux"
import {  setPencil, setToolForm} from "../../redux/slices/tools"

// shapes
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { TbTriangle } from "react-icons/tb";
import { HiOutlineArrowLongUp } from "react-icons/hi2";
import { TbLine } from "react-icons/tb";





const Shapes = () => {
    const dispatch = useDispatch()
  return (
      <>
          <div>
              <button
                  onClick={() => {
                      dispatch(setToolForm('line'))
                      dispatch(setPencil())
                  }}
              ><TbLine/></button>
          </div>
          <div>
              <button
                  onClick={() => {
                      dispatch(setToolForm('square-shape'))
                      dispatch(setPencil())
                  }}
              ><FaRegSquare/></button>
          </div>
          <div>
              <button
                  onClick={() => {
                      dispatch(setToolForm('circle-shape'))
                      dispatch(setPencil())
                  }}
              ><FaRegCircle/></button>
          </div>
          <div>
              <button
                  onClick={() => {
                      dispatch(setToolForm('triangle-shape'))
                      dispatch(setPencil())
                  }}
              ><TbTriangle/></button>
          </div>
      </>
  )
}

export default Shapes