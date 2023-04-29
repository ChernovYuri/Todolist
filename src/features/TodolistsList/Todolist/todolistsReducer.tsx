import {RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {todolistsApi, TodolistType, UpdateTodolistType} from "features/TodolistsList/Todolist/todolists.api";
import {ResultCode} from "common/enums/common.enums";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";
import {tasksThunks} from "features/TodolistsList/tasks/tasksReducer";

const createTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>
('todolists/createTodo', async (title, {rejectWithValue}) => {
    const res = await todolistsApi.createTodolist(title)
    if (res.data.resultCode === ResultCode.OK) {
        return {todolist: res.data.data.item}
    } else {
        return rejectWithValue({data: res.data, showGlobalError: false})
    }
})

const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>
('todolists/fetchTodos', async (arg, {dispatch}) => {
    const res = await todolistsApi.getTodolists()
    await res.data.forEach((todo) => {
        dispatch(tasksThunks.fetchTasks(todo.id))
    })
    return {todolists: res.data}
})

const updateTodoTitle = createAppAsyncThunk<UpdateTodolistType, UpdateTodolistType>
('todolists/updateTodoTitle', async (arg, {dispatch, rejectWithValue}) => {
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'loading'}))
    const res = await todolistsApi.updateTodolist(arg)
    if (res.data.resultCode === ResultCode.OK) {
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'succeeded'}))
        return {todolistId: arg.todolistId, newTitle: arg.newTitle}
    } else {
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: arg.todolistId, entityStatus: 'failed'}))
        return rejectWithValue({data: res.data, showGlobalError: true})
    }

})

const deleteTodo = createAppAsyncThunk<{ todolistId: string }, string>
('todolists/deleteTodo', async (todolistId, {dispatch, rejectWithValue}) => {
    dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'loading'}))
    const res = await todolistsApi.deleteTodolist(todolistId)
    if (res.data.resultCode === ResultCode.OK) {
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'succeeded'}))
        return {todolistId}
    } else {
        dispatch(todolistsActions.changeEntityStatusTodo({todolistId: todolistId, entityStatus: 'failed'}))
        return rejectWithValue({data: res.data, showGlobalError: true})
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