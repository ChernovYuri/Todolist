import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {appActions} from "app/appReducer";

export const handleServiceNetworkError = (dispatch: Dispatch, e: unknown) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(appActions.setError({error}))
    } else {
        dispatch(appActions.setError({error: `Native error ${err.message}`}))
    }
    dispatch(appActions.setStatus({status: 'failed'}))
}