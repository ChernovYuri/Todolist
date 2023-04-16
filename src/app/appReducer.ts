import {authActions} from "features/Auth/authReducer";
import {Dispatch} from "redux";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {handleServiceNetworkError} from "common/utils/handleServiceNetworkError";
import {ResultCode} from "common/enums/common.enums";
import {authApi} from "features/Auth/auth.api";

const initialState = {
    error: null as string | null,
    status: 'idle' as RequestStatusType,
    isInitialized: false
}

// slice
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus: (state: InitialStateType, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setError: (state: InitialStateType, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (state: InitialStateType, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions

// thunks
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    authApi.me()
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
            dispatch(appActions.setIsInitialized({isInitialized: true}))
            dispatch(appActions.setStatus({status: 'idle'}))
        })
}

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = typeof initialState
