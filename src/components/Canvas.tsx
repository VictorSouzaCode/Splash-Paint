
// This component is responsible for:

// Managing canvas drawing behavior

// Listening to mouse events

// Triggering draw actions

// Displaying a brush indicator (a circle following the mouse)

import { useRef, useEffect } from "react"
import { setPointerPosition } from "../redux/slices/tools"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"


const Canvas = () => {
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.tools)

  // use ref to not cause re-renders when drawing
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) { return }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  },[])

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) { return }

    const handleMouseMove = (e:MouseEvent) => {
      dispatch(setPointerPosition({x: e.clientX, y: e.clientY}))
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  },[state])

  return (
    <>
    <canvas 
    ref={canvasRef}
    className="border1 absolute top-0 left-o z-0 cursor-none"/>
    <div className="bg-black absolute rounded-full cursor-none"
    style={{
      left: state.pointer.x - state.size/ 2,
      top: state.pointer.y - state.size / 2,
      width: state.size,
      height: state.size
    }}></div>
    </>
  )
}

export default Canvas