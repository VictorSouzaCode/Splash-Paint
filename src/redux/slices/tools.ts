import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser'

export type ToolState = {
    tool: Tools,
    pencilColor: string,
    borderColor: string,
    screenColor: string,
    size: number,
    pointer: {
        x: number,
        y: number
    }
}


const initialState: ToolState = {
    tool: 'pencil',
    pencilColor: '#000000',
    borderColor: '#000000',
    screenColor: "#ffffff",
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
        increasePointerSize: (state) => {
            state.size += 1
        },
        decreasePointerSize: (state) => {

            if(state.size === 1) return;
            state.size -= 1
        },
        setPointerSize: (state, action: PayloadAction<number>) => {       
            if(action.payload === 1) { return }
            state.size = action.payload
        },
        setPointerPosition: (state, action: PayloadAction<{ x: number, y: number}>) => {
            state.pointer = action.payload
        }
    }
})


export const { setPointerPosition, setPointerSize, increasePointerSize, decreasePointerSize} = toolsSlice.actions;

export default toolsSlice.reducer