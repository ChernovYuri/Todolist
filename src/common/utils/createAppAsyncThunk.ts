import {AppRootStateType} from "app/store";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppThunkDispatch} from "common/hooks/useAppDispatch";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppThunkDispatch
    rejectValue: string
}>()