import {appActions} from "app/appReducer";
import {createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {authApi, LoginParamsType} from "features/Auth/auth.api";
import {ResultCode} from "common/enums/common.enums";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>
('auth/login', async (arg, {rejectWithValue}) => {
    const res = await authApi.login(arg)
    debugger
    if (res.data.resultCode === ResultCode.OK) {
        return {isLoggedIn: true}
    } else if (res.data.resultCode === ResultCode.Captcha) {
        const isShowAppError = !res.data.fieldsErrors.length
        alert('Captcha')
        return rejectWithValue({data: res.data, showGlobalError: isShowAppError})
    } else {
        const isShowAppError = !res.data.fieldsErrors.length
        return rejectWithValue({data: res.data, showGlobalError: isShowAppError})
    }
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

// slice
const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
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
    }
})

export const authReducer = slice.reducer
export const authThunks = {login, logout, initializeApp}