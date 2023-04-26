import {appActions} from "app/appReducer";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppRootStateType} from "app/store";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {AppThunkDispatch} from "common/hooks/useAppDispatch";

export const thunkTryCatch =
    async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppThunkDispatch, string>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        return await logic()
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue('error')
    }
    finally {
        // в handleServerNetworkError можно удалить убраны крутилки
        dispatch(appActions.setAppStatus({status: 'idle'}))
    }
}
