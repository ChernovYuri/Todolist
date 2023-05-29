import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {authApi, LoginParamsType} from "features/Auth/auth.api";
import {ResultCode} from "common/enums/common.enums";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>
('auth/login', async (arg, {dispatch, rejectWithValue}) => {
    const res = await authApi.login(arg)
    if (res.data.resultCode === ResultCode.OK) {
        dispatch(authActions.setCaptchaUrl())
        return {isLoggedIn: true}
    } else if (res.data.resultCode === ResultCode.Captcha) {
        dispatch(getCaptcha())
        return rejectWithValue(null);
    } else {
        const isShowAppError = !res.data.fieldsErrors.length
        return rejectWithValue({data: res.data, showGlobalError: isShowAppError})
    }
})

const getCaptcha = createAppAsyncThunk<{ url: string }, void>
('/security/get-captcha-url', async (arg, {rejectWithValue}) => {
    const res = await authApi.getCaptcha()
    return {url: res.data.url}
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (arg, {dispatch, rejectWithValue}) => {
    const res = await authApi.logout()
    if (res.data.resultCode === ResultCode.OK) {
        dispatch(clearTasksAndTodos())
        return {isLoggedIn: false}
    } else {
        return rejectWithValue({data: res.data, showGlobalError: true})
    }
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/initializeApp', async (arg, {dispatch, rejectWithValue}) => {
    try {
        const res = await authApi.me()
        if (res.data.resultCode === ResultCode.OK) {
            return {isLoggedIn: true}
        } else {
            return rejectWithValue({data: res.data, showGlobalError: false})
        }
    } finally {
        dispatch(appActions.setIsInitialized({isInitialized: true}))
    }
})

const initialState = {
    isLoggedIn: false,
    captchaUrl: ''
}

// slice
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCaptchaUrl: (state: InitialStateType) => {
            state.captchaUrl = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(getCaptcha.fulfilled, (state, action) => {
                state.captchaUrl = action.payload.url
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {login, logout, initializeApp, getCaptcha}
export const authActions = slice.actions

// types
export type InitialStateType = typeof initialState
