import { useEffect } from "react"

type UseUndoRedoProps = {
    engine: ReturnType<typeof import("../typescript/drawingEngine").createDrawingEngine> | null,
}

const useUndoRedo = ({ engine }: UseUndoRedoProps) => {
    useEffect(() => {
        const handleUndo = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'z') {
                await engine?.undo()
            }
        }

        const handleRedo = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'y') {
                await engine?.redo()
            }
        }

        window.addEventListener('keydown', handleUndo)
        window.addEventListener('keydown', handleRedo)

        return () => {
            window.removeEventListener('keydown', handleUndo)
            window.removeEventListener('keydown', handleRedo)
        }
    }, [engine])
}

export default useUndoRedo