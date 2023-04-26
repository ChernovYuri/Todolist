import {appActions} from "app/appReducer";
import {createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {authApi, LoginParamsType} from "features/Auth/auth.api";
import {ResultCode} from "common/enums/common.enums";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>
('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await authApi.login(arg)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(appActions.setAppStatus({status: 'failed'}))
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')
    }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await authApi.logout()
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(clearTasksAndTodos())
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: false}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')
    }
})

const initializeApp = createAppAsyncThunk<{isLoggedIn: boolean}, void>
('auth/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await authApi.me()
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(dispatch, res.data, false)
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')
    } finally {
        dispatch(appActions.setIsInitialized({isInitialized: true}))
    }
})

// slice
const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action)=>{
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action)=>{
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action)=>{
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {login, logout, initializeApp}