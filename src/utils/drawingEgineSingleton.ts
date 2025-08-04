import { createDrawingEngine } from "../typescript/engine/drawingEngine";

let engineInstance: ReturnType<typeof createDrawingEngine> | null = null

export const setEngine = (engine: ReturnType<typeof createDrawingEngine>) => {
    engineInstance = engine
}

export const getEngine = () => {
    if(!engineInstance) throw new Error('Drawing engine not initialized')
    return engineInstance
}