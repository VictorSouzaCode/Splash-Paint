import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Tools = 'pencil' | 'eraser' | 'fill' | 'shape';

export type ToolForm = 'square' | 'circle' | 'line' | 'square-shape' | 'circle-shape' | 'triangle-shape';

export type ToolState = {
    tool: Tools,
    toolForm: ToolForm,
    pencilColor: string,
    screenColor: string,
    size: number,
    isResizing: boolean,
}


const initialState: ToolState = {
    tool: 'pencil',
    toolForm: 'circle',
    pencilColor: '#000000',
    screenColor: "#ffffff",
    size: 15,
    isResizing: false,
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
        setIsResizing: (state, action: PayloadAction<boolean>) => {
            state.isResizing = action.payload
        },
        setEraser: (state) => {
            state.tool = 'eraser'
        },
        setPencil: (state) => {
            state.tool = 'pencil'
        },
        setFill: (state) => {
            state.tool = 'fill'
        },
        setShape: (state) => {
            state.tool = 'shape'
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
    increasePointerSize, 
    decreasePointerSize,
    setIsResizing,
    setEraser, 
    setPencil,
    setPencilColor, 
    setScreenColor,
    setToolForm,
    setFill,
    setShape
} = toolsSlice.actions;

export default toolsSlice.reducer