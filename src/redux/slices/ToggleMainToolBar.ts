import { createSlice } from "@reduxjs/toolkit";


type BarState = {
    isShowing: boolean,
}


const initialState: BarState = {
    isShowing: false,
}


const showToolBarSlice = createSlice({
    name: 'toolBar',
    initialState,
    reducers: {
         toggleToolBar: (state) => {
            state.isShowing = !state.isShowing
        }
    }
})


export const {
    toggleToolBar
} = showToolBarSlice.actions

export default showToolBarSlice.reducer