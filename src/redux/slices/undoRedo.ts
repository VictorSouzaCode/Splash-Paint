import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ToolState } from "./tools"


type StrokeState = {
    history: ToolState[],
    redoStack: ToolState[],
}


const initialState: StrokeState = {
    history: [],
    redoStack: [] // Stores undone strokes, so you can redo them.
}


const strokeSlice = createSlice({
    name: 'strokes',
    initialState,
    reducers: {
        saveStroke: (state, action: PayloadAction<ToolState>) => {
            state.history.push(action.payload);
            state.redoStack = [] // clear redo when drawing new stroke
            console.log(state.history)
        },
        undoStroke: (state) => {

            if(state.history.length === 0) return;

            const undo = state.history.pop();
            if(undo) state.redoStack.unshift(undo)
            console.log(state.history)
            console.log(undo)
            // Removes last stroke and pushes it to redo.
        },
        redoStroke: (state) => {
            if(state.redoStack.length === 0) return;
            const redo = state.redoStack.shift();
            if(redo) state.history.push(redo)
            // Moves stroke from redo back to history. 
        },
        reset: () => {}
    }
})


export const { saveStroke, undoStroke, redoStroke} = strokeSlice.actions
export default strokeSlice.reducer