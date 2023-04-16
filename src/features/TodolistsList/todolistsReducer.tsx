import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {handleServiceNetworkError} from "common/utils/handleServiceNetworkError";
import {todolistApi, TodolistType, UpdateTodolistType} from "features/TodolistsList/todolist.api";
import {ResultCode} from "common/enums/common.enums";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {tasksThunks} from "features/TodolistsList/tasksReducer";
import {Dispatch} from "redux";
import {AppThunkDispatch} from "app/store";

const createTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>
('todolists/createTodo', async (title, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const res = await todolistApi.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            // dispatch(todolistsActions.createTodo({todolist: res.data.data.item}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
        return rejectWithValue('error')

    }
})

const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }>
('todolists/fetchTodos', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const res = await todolistApi.getTodolists()
        // dispatch(todolistsActions.setTodos({todolists: res.data}))
        dispatch(appActions.setStatus({status: 'succeeded'}))
        await res.data.forEach((todo) => {
            dispatch(tasksThunks.fetchTasks(todo.id))
        })
        return {todolists: res.data}
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
        return rejectWithValue('error')
    }

})

/*export const fetchTodosTC = () => (dispatch: any) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    todolistApi.getTodolists()
        .then((res) => {
            // dispatch(todolistsActions.setTodos({todolists: res.data}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return res.data
        })
        .then((todos) => {
            todos.forEach((todo) => {
                dispatch(tasksThunks.fetchTasks(todo.id))
            })
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(appActions.setStatus({status: 'idle'}))
        })
}*/

const updateTodoTitle = createAppAsyncThunk<UpdateTodolistType, UpdateTodolistType>
('todolists/updateTodoTitle', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistApi.updateTodolist(arg)
        if (res.data.resultCode === ResultCode.OK) {
            // dispatch(todolistsActions.updateTodo({todolistId: todolistId, newTitle: title}))
            dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'succeeded'}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return {todolistId: arg.todolistId, newTitle: arg.newTitle}
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'failed'}))
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'failed'}))
        return rejectWithValue('error')
    }
})

const deleteTodo = createAppAsyncThunk<{ todolistId: string }, string>
('todolists/deleteTodo', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'loading'}))
    try {
        await todolistApi.deleteTodolist(todolistId)
        // dispatch(todolistsActions.removeTodo({todolistId: todolistId}))
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'succeeded'}))
        dispatch(appActions.setStatus({status: 'succeeded'}))
        return {todolistId}
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
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
        // createTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolist: TodolistType }>) => {
        //     state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        // },
        // setTodos: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
        //     return action.payload.todolists.map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
        // },
        // updateTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolistId: string, newTitle: string }>) => {
        //     const index = state.findIndex(todo => todo.id === action.payload.todolistId)
        //     if (index !== -1) state[index].title = action.payload.newTitle
        // },
        changeFilterTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeEntityStatusTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
        // removeTodo: (state: TodolistDomainType[], action: PayloadAction<{ todolistId: string }>) => {
        //     const index = state.findIndex(todo => todo.id === action.payload.todolistId)
        //     if (index !== -1) state.splice(index, 1)
        // },
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

// thunks
/*export const fetchTodosTC = () => (dispatch: any) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(todolistsActions.setTodos({todolists: res.data}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return res.data
        })
        .then((todos) => {
            todos.forEach((todo) => {
                dispatch(tasksThunks.fetchTasks(todo.id))
            })
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(appActions.setStatus({status: 'idle'}))
        })
}*/

/*export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatusTodo({todoId: todolistId, entityStatus: 'loading'}))
    todolistApi.deleteTodolist(todolistId)
        .then(() => {
            dispatch(todolistsActions.removeTodo({todolistId: todolistId}))
            dispatch(todolistsActions.changeEntityStatusTodo({todoId: todolistId, entityStatus: 'succeeded'}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
        })
        .catch((error) => {
            dispatch(appActions.setStatus({status: 'failed'}))
            dispatch(todolistsActions.changeEntityStatusTodo({todoId: todolistId, entityStatus: 'failed'}))
            dispatch(appActions.setError({error: error.message}))
        })
}*/

/*export const createTodoTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    todolistApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(todolistsActions.createTodo({todolist: res.data.data.item}))
                dispatch(appActions.setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
            dispatch(appActions.setStatus({status: 'idle'}))
        }).catch((err) => {
        handleServiceNetworkError(dispatch, err)
    })
}*/

/*export const changeTodoTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'loading'}))
    todolistApi.updateTodolist(todolistId, title)
        .then((res) => {
            console.log(res)
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(todolistsActions.updateTodo({todolistId: todolistId, newTitle: title}))
                dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'succeeded'}))
                dispatch(appActions.setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
                dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'failed'}))
            }
        }).catch(err => {
        handleServiceNetworkError(dispatch, err)
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'failed'}))
    })
}*/

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}