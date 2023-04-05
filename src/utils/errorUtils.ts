import {AppActionstype, setErrorAC, setStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";

export const handleServiceNetworkError = (dispatch: ErrorUtilsDispatchType, error: {message:string}) => {
    dispatch(setStatusAC('failed'))
    dispatch(setErrorAC(error.message ? error.message : 'Unknown Error'
))
}

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Unknown Error'))
    }
    dispatch(setStatusAC('failed'))
}


type ErrorUtilsDispatchType = Dispatch<AppActionstype>