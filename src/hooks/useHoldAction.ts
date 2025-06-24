import { useRef } from "react";

// This Hook servers to increase the mouse size clicking or holding a button

type ActionFunction = () => void;


export const useHoldAction = (action: ActionFunction) => {
    const intervalRef = useRef<number | null>(null);

    const onMouseDown = () => {
        action()
        intervalRef.current = setInterval(() => {
            action()
        },50)
    }

    const onMouseUp = () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    return {
        onMouseDown,
        onMouseUp,
    }
    
}