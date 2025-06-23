import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser'

export type ToolState = {
    tool: Tools,
    size: number,
    pointer: {
        x: number,
        y: number
    }
}


const initialState: ToolState = {
    tool: 'pencil',
    size: 40,
    pointer: {
        x: 0,
        y: 0
    }
}


const toolsSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setPointerPosition: (state, action: PayloadAction<{ x: number, y: number}>) => {
            state.pointer = action.payload
        }
    }
})


export const { setPointerPosition } = toolsSlice.actions;

export default toolsSlice.reducer