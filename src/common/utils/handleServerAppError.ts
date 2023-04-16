import {appActions} from "app/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "common/types/common.types";

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(appActions.setError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setError({error: 'Unknown Error'}))
    }
    dispatch(appActions.setStatus({status: 'failed'}))
}

type ErrorUtilsDispatchType = Dispatch