import {Dispatch} from "redux";
import {appActions} from "app/appReducer";
import axios from "axios";
import {ValuesType} from "features/Auth/Auth";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "features/TodolistsList/todolistsReducer";
import {tasksActions} from "features/TodolistsList/tasksReducer";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {handleServiceNetworkError} from "common/utils/handleServiceNetworkError";
import {authApi} from "features/Auth/auth.api";
import {ResultCode} from "common/enums/common.enums";

// slice
const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) =>{
           state.isLoggedIn = action.payload.isLoggedIn
            // return {...state, isLoggedIn: action.payload.value}
        }
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions

// по документации:
// export const {setIsLoggedIn, setIsInitialized} = slice.actions

// thunks
export const loginTC = (data: ValuesType) => async (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    authApi.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err) => {
            if (axios.isAxiosError<{ message: string }>(err)) {
                handleServiceNetworkError(dispatch, err)
            }
        })
        .finally(() => {
            dispatch(appActions.setStatus({status: 'idle'}))
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
                dispatch(appActions.setStatus({status: 'succeeded'}))
                dispatch(tasksActions.clearTasks())
                dispatch(todolistsActions.clearTodos())
                dispatch(clearTasksAndTodos())

            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
}