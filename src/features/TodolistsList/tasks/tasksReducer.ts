import {todolistsActions, todolistsThunks} from "features/TodolistsList/Todolist/todolistsReducer";
import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {ResultCode, TaskPriorities, TaskStatuses} from "common/enums/common.enums";
import {
    CreateTaskArgType,
    DeleteTaskArgType,
    tasksApi,
    TaskType,
    UpdateTaskArgType, UpdateTaskModelType
} from "features/TodolistsList/tasks/tasks.api";

// thunks
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await tasksApi.getTasks(todolistId)
        // dispatch(tasksActions.fetchTasks({todoId: todolistId, tasks: res.data.items}))
        let tasks = res.data.items
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')
    } finally {
        dispatch(appActions.setAppStatus({status: 'idle'}))
    }
})

export const createTask = createAppAsyncThunk<{ newTask: TaskType }, CreateTaskArgType>
('tasks/createTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    // через нативные try catch
    try {
        const res = await tasksApi.createTask(arg)
        if (res.data.resultCode === ResultCode.OK) {
            let newTask = res.data.data.item
            // dispatch(tasksActions.createTask({newTask: res.data.data.item}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {newTask}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue('error')
    }
})

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.changeEntityStatusTask(
        {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading'}))
    try {
        const task = getState().tasks[arg.todolistId].find((task) => task.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setAppError({error: 'task not found'}))
            return rejectWithValue('error')
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            entityStatus: 'idle',
            ...arg.model
        }
        const res = await tasksApi.updateTask({todolistId: arg.todolistId, taskId: arg.taskId, model: apiModel})
        if (res.data.resultCode === ResultCode.OK) {
            // dispatch(tasksActions.updateTask({todoId: arg.todolistId, taskId: arg.taskId, model: arg.model}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.changeEntityStatusTask(
                {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'idle'}))
            return arg
            /*return {todolistId: arg.todolistId,
                taskId: arg.taskId,
                entityStatus: 'idle'}*/
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(tasksActions.changeEntityStatusTask(
                {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'idle'}))
            return rejectWithValue('error')
        }
        // dispatch(appActions.setStatus({status: 'idle'}))
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        dispatch(tasksActions.changeEntityStatusTask(
            {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'idle'}))
        return rejectWithValue('error')
    }
})

export const deleteTask = createAppAsyncThunk<DeleteTaskArgType, DeleteTaskArgType>
('tasks/deleteTask', async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.changeEntityStatusTask({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading'}))
    try {
        await tasksApi.deleteTask({todolistId: arg.todolistId, taskId: arg.taskId})
        dispatch(tasksActions.changeEntityStatusTask({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'idle'
        }))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolistId: arg.todolistId, taskId: arg.taskId}
    } catch (err) {
        handleServerNetworkError(dispatch, err)
        dispatch(tasksActions.changeEntityStatusTask({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'failed'
        }))
        return rejectWithValue('error')
    }
})

const initialState: TasksDomainType = {}

// slice
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changeEntityStatusTask: (state: TasksDomainType, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) => {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
        },
        clearTasks: () => {
            return {}
        }
    },
    extraReducers: (builder) => {
        builder
            //actions
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
                    .map(task => ({...task, entityStatus: 'idle'}))
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state[action.payload.newTask.todoListId].unshift({...action.payload.newTask, entityStatus: 'idle'})
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) state[action.payload.todolistId].splice(index, 1)
            })

            .addCase(todolistsThunks.createTodo.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsThunks.deleteTodo.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todolistsThunks.fetchTodos.fulfilled, (state, action) => {
                action.payload.todolists.forEach((todolist) => {
                    state[todolist.id] = []
                })
            })
            .addCase(todolistsActions.clearTodos, () => {
                return {}
            })
            .addCase(clearTasksAndTodos, () => {
                return {}
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, createTask, updateTask, deleteTask}

// types
export type TasksType = {
    [key: string]: TaskType[]
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}
export type TasksDomainType = {
    [key: string]: TaskDomainType[]
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}