import {todolistsActions, todolistsThunks} from "features/TodolistsList/Todolist/todolistsReducer";
import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";
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
('tasks/fetchTasks', async (todolistId) => {
    const res = await tasksApi.getTasks(todolistId)
    const tasks = res.data.items
    return {tasks, todolistId}
})

export const createTask = createAppAsyncThunk<{ newTask: TaskType }, CreateTaskArgType>
('tasks/createTask', async (arg, {rejectWithValue}) => {
    const res = await tasksApi.createTask(arg)
    if (res.data.resultCode === ResultCode.OK) {
        let newTask = res.data.data.item
        return {newTask}
    } else {
        return rejectWithValue({data: res.data, showGlobalError: false})
    }

})

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    dispatch(tasksActions.changeEntityStatusTask(
        {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading'}))
    const task = getState().tasks[arg.todolistId].find((task) => task.id === arg.taskId)
    if (!task) {
        dispatch(appActions.setAppError({error: 'task not found'}))
        return rejectWithValue(null)
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
        dispatch(tasksActions.changeEntityStatusTask({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'idle'
        }))
        return arg
    } else {
        dispatch(tasksActions.changeEntityStatusTask(
            {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'failed'}))
        return rejectWithValue({data: res.data, showGlobalError: true})
    }
})

export const deleteTask = createAppAsyncThunk<DeleteTaskArgType, DeleteTaskArgType>
('tasks/deleteTask', async (arg, {dispatch, rejectWithValue}) => {
    dispatch(tasksActions.changeEntityStatusTask({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: 'loading'
    }))
    const res = await tasksApi.deleteTask({todolistId: arg.todolistId, taskId: arg.taskId})
    if (res.data.resultCode === ResultCode.OK) {
        dispatch(tasksActions.changeEntityStatusTask({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'idle'
        }))
        return {todolistId: arg.todolistId, taskId: arg.taskId}
    } else {
        return rejectWithValue({data: res.data, showGlobalError: true})
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