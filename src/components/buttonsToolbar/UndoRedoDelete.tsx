import { useEffect } from "react";
import { getEngine } from "../../utils/drawingEgineSingleton"
import { useSelector } from "react-redux";
import type { ToolState} from "../../redux/slices/tools";
import type { Point } from "../../utils/types";
import type { RootState } from "../../redux/store";

import { PiArrowLeftFill } from "react-icons/pi";
import { PiArrowRightFill } from "react-icons/pi";
import { TfiTrash } from "react-icons/tfi";

const UndoRedoDelete = () => {
    const state = useSelector((state: RootState) => state.tools)

    let engine: {
        startStroke: (point: Point, state: ToolState) => void;
        updateStroke: (point: Point, state: ToolState) => void;
        endStroke: (state: ToolState) => Promise<void>;
        undo: () => Promise<void>;
        redo: () => Promise<void>;
        clear: () => Promise<void>;
    };
    useEffect(() => {
        try {
          engine = getEngine();
        } catch (err) {
          console.warn("Drawing engine not ready:", err);
          return;
        }
    }, [state])

  return (
    <>
          <button
              className="rounded-md active:text-gray-400 w-[30px] h-[30px] flex-center"
              onClick={() => {
                  engine && engine.undo()
              }}
          >
              <PiArrowLeftFill />
          </button>
          <button
              className="rounded-md active:text-gray-400 w-8 h-[30px] flex-center"
              onClick={() => {
                  engine && engine.redo()
              }}
          >
              <PiArrowRightFill />
          </button>
          <button
              className="active:text-gray-400 rounded-md"
              onClick={() => {
                  engine && engine.clear()
              }}
          >
              <TfiTrash />
          </button>
    </>
    
  )
}

export default UndoRedoDelete