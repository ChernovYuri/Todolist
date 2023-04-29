import {tasksReducer} from 'features/TodolistsList/tasks/tasksReducer';
import {todolistsReducer} from 'features/TodolistsList/Todolist/todolistsReducer';
import {combineReducers} from 'redux';
import {appReducer} from "app/appReducer";
import {authReducer} from "features/Auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    // thunk middleware идет по умолчанию, поэтому его необязательно добавлять.
    // Но если/когда понадобится делаем это через .concat(..)
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
    })

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;