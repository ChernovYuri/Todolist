import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {todolistsApi, TodolistType, UpdateTodolistType} from "features/TodolistsList/Todolist/todolists.api";
import {ResultCode} from "common/enums/common.enums";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";
import {tasksThunks} from "features/TodolistsList/tasks/tasksReducer";

const createTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>
('todolists/createTodo', async (title, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsApi.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            // dispatch(todolistsActions.createTodo({todolist: res.data.data.item}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')

    }
})

const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>
('todolists/fetchTodos', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsApi.getTodolists()
        // dispatch(todolistsActions.setTodos({todolists: res.data}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        await res.data.forEach((todo) => {
            dispatch(tasksThunks.fetchTasks(todo.id))
        })
        return {todolists: res.data}
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')
    }

})

const updateTodoTitle = createAppAsyncThunk<UpdateTodolistType, UpdateTodolistType>
('todolists/updateTodoTitle', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistsApi.updateTodolist(arg)
        if (res.data.resultCode === ResultCode.OK) {
            // dispatch(todolistsActions.updateTodo({todolistId: todolistId, newTitle: title}))
            dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'succeeded'}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolistId: arg.todolistId, newTitle: arg.newTitle}
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'failed'}))
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'failed'}))
        return rejectWithValue('error')
    }
})

const deleteTodo = createAppAsyncThunk<{ todolistId: string }, string>
('todolists/deleteTodo', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'loading'}))
    try {
        await todolistsApi.deleteTodolist(todolistId)
        // dispatch(todolistsActions.removeTodo({todolistId: todolistId}))
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'succeeded'}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolistId}
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'failed'}))
        return rejectWithValue('error')
    }
})


const initialState: TodolistDomainType[] = []

// slice
const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        changeFilterTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeEntityStatusTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
        clearTodos: () => {
            return []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTodo.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                return action.payload.todolists.map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
            })
            .addCase(updateTodoTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index !== -1) state[index].title = action.payload.newTitle
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index !== -1) state.splice(index, 1)
            })

            .addCase(clearTasksAndTodos, () => {
                return []
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {deleteTodo, createTodo, updateTodoTitle, fetchTodos}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}