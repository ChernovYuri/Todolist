import {todolistsActions, todolistsThunks} from "./todolistsReducer";
import {appActions, RequestStatusType} from "app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServiceNetworkError} from "common/utils/handleServiceNetworkError";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {
    CreateTaskArgType, DeleteTaskArgType,
    TaskType,
    todolistApi,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/TodolistsList/todolist.api";
import {ResultCode, TaskPriorities, TaskStatuses} from "common/enums/common.enums";

// thunks
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const res = await todolistApi.getTasks(todolistId)
        // dispatch(tasksActions.fetchTasks({todoId: todolistId, tasks: res.data.items}))
        let tasks = res.data.items
        dispatch(appActions.setStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
        return rejectWithValue('error')
    } finally {
        dispatch(appActions.setStatus({status: 'idle'}))
    }
})

export const createTask = createAppAsyncThunk<{ newTask: TaskType }, CreateTaskArgType>
('tasks/createTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    // через нативные try catch
    try {
        const res = await todolistApi.createTask(arg)
        if (res.data.resultCode === ResultCode.OK) {
            let newTask = res.data.data.item
            // dispatch(tasksActions.createTask({newTask: res.data.data.item}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return {newTask}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue('error')
        }
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
        return rejectWithValue('error')
    }
})

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(tasksActions.changeEntityStatusTask(
        {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading'}))
    try {
        const task = getState().tasks[arg.todolistId].find((task) => task.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setError({error: 'task not found'}))
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
        const res = await todolistApi.updateTask({todolistId: arg.todolistId, taskId: arg.taskId, model: apiModel})
        if (res.data.resultCode === ResultCode.OK) {
            // dispatch(tasksActions.updateTask({todoId: arg.todolistId, taskId: arg.taskId, model: arg.model}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
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
        handleServiceNetworkError(dispatch, err)
        dispatch(tasksActions.changeEntityStatusTask(
            {todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'idle'}))
        return rejectWithValue('error')
    }
})

export const deleteTask = createAppAsyncThunk<DeleteTaskArgType, DeleteTaskArgType>
('tasks/deleteTask', async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(tasksActions.changeEntityStatusTask({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading'}))
    try {
        await todolistApi.deleteTask({todolistId: arg.todolistId, taskId: arg.taskId})
        dispatch(tasksActions.changeEntityStatusTask({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'idle'
        }))
        dispatch(appActions.setStatus({status: 'succeeded'}))
        return {todolistId: arg.todolistId, taskId: arg.taskId}
    } catch (err) {
        handleServiceNetworkError(dispatch, err)
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
        /*createTask: (state: TasksDomainType, action: PayloadAction<{ newTask: TaskType }>) => {
            state[action.payload.newTask.todoListId].unshift({...action.payload.newTask, entityStatus: 'idle'})
        },*/
        /*fetchTasks: (state: TasksDomainType, action: PayloadAction<{ todoId: string, tasks: TaskType[] }>) => {
            state[action.payload.todoId] = action.payload.tasks
                .map(task => ({...task, entityStatus: 'idle'}))
        },*/
        /*updateTask: (state: TasksDomainType, action: PayloadAction<{ todoId: string, taskId: string, model: UpdateDomainTaskModelType }>) => {
            const index = state[action.payload.todoId].findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) state[action.payload.todoId][index] = {...state[action.payload.todoId][index], ...action.payload.model}
        },*/
        /*removeTask: (state: TasksDomainType, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) state[action.payload.todolistId].splice(index, 1)
        },*/
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

// thunks
/*export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    todolistApi.getTasks(todolistId)
        .then((res) => {
            // const {items, error, totalCount} = res.data
            // const items = res.data.items
            // console.log(items)
            dispatch(tasksActions.fetchTasks({todoId: todolistId, tasks: res.data.items}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(appActions.setStatus({status: 'idle'}))
        })
}*/

/*export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(tasksActions.changeEntityStatusTask({todoId: todolistId, taskId: taskId, entityStatus: 'loading'}))
    todolistApi.deleteTask(todolistId, taskId)
        .then(() => {
            // const {items, error, totalCount} = res.data
            // console.log(items)
            dispatch(tasksActions.removeTask({todoId: todolistId, taskId: taskId}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
            dispatch(tasksActions.changeEntityStatusTask({
                todoId: todolistId,
                taskId: taskId,
                entityStatus: 'idle'
            }))
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
}*/

/*export const createTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    // через нативные try catch
    try {
        const res = await todolistApi.createTask(todolistId, title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(tasksActions.createTask({newTask: res.data.data.item}))
            dispatch(appActions.setStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res.data)
        }

    } catch (err) {

        // if (axios.isAxiosError<{ message: string }>(err)) {
            handleServiceNetworkError(dispatch, err)
        // }
    }
}*/
// через async await .then .catch
//     const res = await todolistApi.createTask(todolistId, title)
//         .then((res) => {
//                 if (res.data.resultCode === ResultCode.OK) {
//                     dispatch(addTaskAC(todolistId, res.data.data.item))
//                     setStatusAC('succeeded')
//                 } else {
//                     handleServerAppError(dispatch, res.data)
//                 }
//                 dispatch(setStatusAC('idle'))
//             }
//         ).catch((err) => {
//         handleServiceNetworkError(dispatch, err)
//     })
// }

/*
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(appActions.setStatus({status: 'loading'}))
        dispatch(tasksActions.changeEntityStatusTask({todoId: todolistId, taskId: taskId, entityStatus: 'loading'}))
        const task = getState().tasks[todolistId].find((task) => task.id === taskId)
        if (!task) {
            dispatch(appActions.setError({error: 'task not found'}))
            return
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            entityStatus: 'idle',
            ...domainModel
        }
        todolistApi.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === ResultCode.OK) {
                    dispatch(tasksActions.updateTask({todoId: todolistId, taskId: taskId, model: domainModel}))
                    dispatch(appActions.setStatus({status: 'succeeded'}))
                    dispatch(tasksActions.changeEntityStatusTask({
                        todoId: todolistId,
                        taskId: taskId,
                        entityStatus: 'idle'
                    }))
                } else {
                    handleServerAppError(dispatch, res.data)
                }
                dispatch(appActions.setStatus({status: 'idle'}))
            }).catch((err: AxiosError<{ message: string }>) => {
            handleServiceNetworkError(dispatch, err)
        })
    }
*/

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