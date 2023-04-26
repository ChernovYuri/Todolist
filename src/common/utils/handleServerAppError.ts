import {appActions} from "app/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "common/types/common.types";

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>, showError: boolean = true) => {
    if (showError) {
        dispatch(appActions.setAppError(data.messages.length ? {error: data.messages[0]} : {error: 'Unknown Error'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

type ErrorUtilsDispatchType = Dispatch