import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser';

export type ToolForm = 'square' | 'circle' | 'line' | 'square-shape' | 'circle-shape' | 'triangle-shape';

export type StoredStrokes = {x:number, y:number}

export type ToolState = {
    tool: Tools,
    toolForm: ToolForm,
    pencilColor: string,
    borderColor: string,
    screenColor: string,
    size: number,
    isDrawing: boolean,
    pointer: {
        x: number,
        y: number
    }
    storedStrokes: StoredStrokes[]
}


const initialState: ToolState = {
    tool: 'pencil',
    toolForm: 'circle',
    pencilColor: '#000000',
    borderColor: '#000000',
    screenColor: "#ffffff",
    isDrawing: false,
    size: 15,
    pointer: {
        x: 0,
        y: 0
    },
    storedStrokes: []
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
        },
        setScreenColor: (state, action: PayloadAction<string>) => {
            state.screenColor = action.payload
        },
        setToolForm: (state, action: PayloadAction<ToolForm>) => {
            state.toolForm = action.payload
        }
    }
})


export const { 
    setPointerPosition, 
    increasePointerSize, 
    decreasePointerSize, 
    setDrawing, 
    setEraser, 
    setPencil,
    setPencilColor, 
    setScreenColor,
    setToolForm
} = toolsSlice.actions;

export default toolsSlice.reducer