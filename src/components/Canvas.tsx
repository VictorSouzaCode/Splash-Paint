
// This component is responsible for:

// Managing canvas drawing behavior

// Listening to mouse events

// Triggering draw actions

// Displaying a brush indicator (a circle following the mouse)

import { useRef, useEffect, useState } from "react"

// remove it later
type MouseMoveState = {
  x: number,
  y: number
}

const Canvas = () => {

  // use ref to not cause re-renders when drawing
  const canvasRef = useRef<HTMLCanvasElement |  null>(null)

  // remove it later
  const circleSize = 40;
  const [moviment, setMoviment] =useState<MouseMoveState>({x: 0, y: 0})

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
      setMoviment({
        x: e.clientX,
        y: e.clientY
      })
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  },[moviment])

  return (
    <>
    <canvas 
    ref={canvasRef}
    className="border1 absolute top-0 left-o z-0 cursor-none"/>
    <div className="bg-black absolute rounded-full cursor-none"
    style={{
      left: moviment.x - circleSize / 2,
      top: moviment.y - circleSize / 2,
      width: circleSize,
      height: circleSize
    }}></div>
    </>
  )
}

export default Canvas