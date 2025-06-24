import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser'

export type ToolState = {
    tool: Tools,
    pencilColor: string,
    borderColor: string,
    screenColor: string,
    size: number,
    isDrawing: boolean,
    pointer: {
        x: number,
        y: number
    },
    test: string
}


const initialState: ToolState = {
    tool: 'pencil',
    pencilColor: '#000000',
    borderColor: '#000000',
    screenColor: "#ffffff",
    isDrawing: false,
    size: 20,
    pointer: {
        x: 0,
        y: 0
    },
    test: ''
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
        setPointerPosition: (state, action: PayloadAction<{ x: number, y: number}>) => {
            state.pointer = action.payload
        },
        setDrawing: (state, action: PayloadAction<boolean>) => {
            state.isDrawing = action.payload
            // console.log(state.isDrawing)
        },
        setEraser: (state) => {
            state.tool = 'eraser'
        },
        setPencil: (state) => {
            state.tool = 'pencil'
        }, 
        setPencilColor: (state, action: PayloadAction<string>) => {
            state.pencilColor = action.payload
        }
    }
})


export const { setPointerPosition, increasePointerSize, decreasePointerSize, setDrawing, setEraser, setPencil, setPencilColor} = toolsSlice.actions;

export default toolsSlice.reducer