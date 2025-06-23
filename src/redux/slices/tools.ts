import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser'

export type ToolState = {
    tool: Tools,
    size: number,
    pencilColor: string,
    borderColor: string,
    bgColor: string,
    pointer: {
        x: number,
        y: number
    }
}


const initialState: ToolState = {
    tool: 'pencil',
    pencilColor: '#000000',
    borderColor: '#000000',
    bgColor: "#ffffff",
    size: 20,
    pointer: {
        x: 0,
        y: 0
    }
}


const toolsSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setPointerSize: (state, action: PayloadAction<number>) => {       
            if(action.payload === 1) { return }
            state.size = action.payload

            setInterval(() => {
                state.size = action.payload
            }, 100)
        },
        setPointerPosition: (state, action: PayloadAction<{ x: number, y: number}>) => {
            state.pointer = action.payload
        }
    }
})


export const { setPointerPosition, setPointerSize } = toolsSlice.actions;

export default toolsSlice.reducer