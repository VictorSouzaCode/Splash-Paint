import { configureStore } from "@reduxjs/toolkit";
import toolsReducer from "./slices/tools";
import configToolBarReducer from "./slices/configToolBar";


export const store = configureStore({
    reducer: {
        tools: toolsReducer,
        configBar: configToolBarReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;