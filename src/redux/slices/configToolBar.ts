import { createSlice } from "@reduxjs/toolkit";


type BarState = {
    isActive: boolean,
}


const initialState: BarState = {
    isActive: false,
}


const configBarSlice = createSlice({
    name: 'configBar',
    initialState,
    reducers: {
         setConfigBar: (state) => {
            state.isActive = !state.isActive
        }
    }
})


export const {
    setConfigBar
} = configBarSlice.actions

export default configBarSlice.reducer