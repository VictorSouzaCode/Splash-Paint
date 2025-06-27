import { configureStore } from "@reduxjs/toolkit";
import toolsReducer from "./slices/tools";
import strokeSlice from "./slices/undoRedo"


export const store = configureStore({
    reducer: {
        tools: toolsReducer,
        undoRedo: strokeSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;