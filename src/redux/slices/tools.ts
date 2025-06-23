import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser'

export type ToolState = {
    tool: Tools,
    pointer: {
        x: number,
        y: number
    }
}


const initialState: ToolState = {
    tool: 'pencil',
    pointer: {
        x: 0,
        y: 0
    }
}


const toolsSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setPointerPosition: () => {}
    }
})


export const { setPointerPosition } = toolsSlice.actions;

export default toolsSlice.reducer