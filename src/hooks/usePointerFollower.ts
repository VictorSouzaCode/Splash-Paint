import { useRef, useEffect } from 'react';


export const usePointerFollower = () => {
  const followerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      positionRef.current = { 
        x: e.clientX - (followerRef.current?.offsetWidth || 0) / 2,
        y: e.clientY - (followerRef.current?.offsetHeight || 0) / 2
      };
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
  }, []);

  return {
    followerRef
  }
};