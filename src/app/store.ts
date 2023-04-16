import {tasksReducer} from 'features/TodolistsList/tasksReducer';
import {todolistsReducer} from 'features/TodolistsList/todolistsReducer';
import {AnyAction, combineReducers} from 'redux';
import {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "app/appReducer";
import {authReducer} from "features/Auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
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

// export const _store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;