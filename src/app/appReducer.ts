import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
        setAppStatus: (state: InitialStateType, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state: InitialStateType, action: PayloadAction<{ error: string | null }>) => {
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
/*export const initializeAppTC = () => async (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    authApi.me()
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(authThunks.setIsLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err) => {
            // if (axios.isAxiosError<{ message: string }>(err)) {
                handleServiceNetworkError(dispatch, err)
            // }
        })
        .finally(() => {
            dispatch(appActions.setIsInitialized({isInitialized: true}))
            dispatch(appActions.setAppStatus({status: 'idle'}))
        })
}*/

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = typeof initialState
