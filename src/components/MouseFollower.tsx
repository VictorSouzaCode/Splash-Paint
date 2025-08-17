import type { RootState } from "../redux/store"
import { useSelector } from "react-redux"
import { useEffect, useRef } from "react"


const MouseFollower = () => {
  const state = useSelector((state: RootState) => state.tools)

  const {isResizing} = useSelector((state:RootState) => state.tools)

  const followerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {

      if (!state.isResizing) {

        positionRef.current = {
          x: e.clientX - (followerRef.current?.offsetWidth || 0) / 2,
          y: e.clientY - (followerRef.current?.offsetHeight || 0) / 2
        };
      }
    };

    const animate = () => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(
            ${positionRef.current.x}px, 
            ${positionRef.current.y}px, 
            0
          )`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updatePosition);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      cancelAnimationFrame(animationRef.current!);
    };
  }, [state.isResizing]);
  
  return (
    <>
      {(!isResizing && state.tool !== 'fill') &&
        <div
          ref={followerRef}
          className="absolute pointer-events-none z-0"
          style={{
            borderRadius: state.toolForm === 'circle' || state.toolForm === 'line' || state.toolForm === 'circle-shape' ? '50%' : '0%',
            width: state.size,
            height: state.size,
            borderWidth: state.tool === 'eraser' ? '2px' : '1px',
            borderStyle: 'solid',
            borderColor: state.tool === 'eraser' ? 'black' : state.pencilColor,
            willChange: 'transform',
          }}
        />
      }
    </>
  )
}

export default MouseFollower