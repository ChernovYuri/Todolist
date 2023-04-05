import {Dispatch} from "redux";
import {SetErrorACType, setStatusAC, SetStatusACType} from "../../app/app-reducer";
import {authApi, ResultCode} from "../../api/todolist-api";
import {handleServerAppError, handleServiceNetworkError} from "../../utils/errorUtils";
import axios from "axios";
import {ValuesType} from "./Login";

const initialState = {
    isLoggedIn: false,
    isInitialized: false,
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.payload.value}
        case 'login/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.payload.isInitialized}
        default:
            return state
    }

}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', payload: {value}} as const)

export const setIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'login/SET-IS-INITIALIZED', payload: {isInitialized}} as const)

// thunks
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    authApi.me()
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setStatusAC('succeeded'))
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
            dispatch(setIsInitializedAC(true))
            dispatch(setStatusAC('idle'))
        })
}

export const loginTC = (data: ValuesType) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    authApi.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setStatusAC('succeeded'))
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
            dispatch(setStatusAC('idle'))
        })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
}


type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsInitializedAC>
    | SetStatusACType
    | SetErrorACType