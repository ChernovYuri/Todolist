import {AddTodolistsACType, RemoveTodolistsACType, SetTodolistsACType} from "./todolistsReducer";
import {
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistApi,
    UpdateTaskModelType
} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, setErrorAC, SetErrorACType, setStatusAC, SetStatusACType} from "../../app/app-reducer";
import {handleServerAppError, handleServiceNetworkError} from "../../utils/errorUtils";
import axios, {AxiosError} from "axios";


const initialState: TasksDomainType = {}
export const tasksReducer = (state: TasksDomainType = initialState, action: ActionsType): TasksDomainType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.payload.todolists.forEach((todolist) => {
                copyState[todolist.id] = []
            })
            return copyState
        }
        case 'ADD-TODOLIST':
            return {...state, [action.payload.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            let copyState = {...state}
            delete copyState[action.payload.todolistId]
            return copyState
        }
        case "SET-TASKS": {
            return {
                ...state, [action.payload.todolistId]: action.payload.tasks
                    .map(el => ({...el, entityStatus: 'idle'}))
            }
        }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.newTask.todoListId]: [{...action.payload.newTask, entityStatus: 'idle'},
                    ...state[action.payload.newTask.todoListId]]
            }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId]
                        .map(el => el.id === action.payload.taskId ? {...el, ...action.payload.model} : el)
            }
        }
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .filter(el => el.id !== action.payload.taskId)
            }
        case 'CHANGE-ENTITY-TASK-STATUS':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(el => el.id === action.payload.taskId
                        ? {...el, entityStatus: action.payload.entityStatus} : el)
            }
        default:
            return state
    }
}

// actions
export const addTaskAC = (newTask: TaskType) =>
    ({type: 'ADD-TASK', payload: {newTask}} as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    ({type: 'UPDATE-TASK', payload: {todolistId, taskId, model}} as const)
export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', payload: {todolistId, taskId}} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', payload: {todolistId, tasks}} as const)
export const changeEntityStatusTaskAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-ENTITY-TASK-STATUS', payload: {todolistId, taskId, entityStatus}} as const)

// thunks
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    todolistApi.getTasks(todolistId)
        .then((res) => {
            // const {items, error, totalCount} = res.data
            // const items = res.data.items
            // console.log(items)
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setStatusAC('succeeded'))
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(setStatusAC('idle'))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeEntityStatusTaskAC(todolistId, taskId, 'loading'))
    todolistApi.deleteTask(todolistId, taskId)
        .then((res) => {
            // const {items, error, totalCount} = res.data
            // console.log(items)
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setStatusAC('succeeded'))
            dispatch(changeEntityStatusTaskAC(todolistId, taskId, 'idle'))
        })
        .catch((err) => {
            handleServiceNetworkError(dispatch, err)
        })
}

export const createTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    // через нативные try catch
    try {
        const res = await todolistApi.createTask(todolistId, title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }

    } catch (err) {

        if (axios.isAxiosError<{ message: string }>(err)) {
            handleServiceNetworkError(dispatch, err)
        }
    }
}
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

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(setStatusAC('loading'))
        dispatch(changeEntityStatusTaskAC(todolistId, taskId, 'loading'))
        const task = getState().tasks[todolistId].find((task) => task.id === taskId)
        if (!task) {
            dispatch(setErrorAC('task not found'))
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
                    dispatch(updateTaskAC(todolistId, taskId, domainModel))
                    dispatch(setStatusAC('succeeded'))
                    dispatch(changeEntityStatusTaskAC(todolistId, taskId, 'idle'))
                } else {
                    handleServerAppError(dispatch, res.data)
                }
                dispatch(setStatusAC('idle'))
            }).catch((err: AxiosError<{ message: string }>) => {
            handleServiceNetworkError(dispatch, err)
        })
    }


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
type ActionsType =
    | AddTodolistsACType
    | RemoveTodolistsACType
    | SetTodolistsACType
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof setTasksAC>
    | SetStatusACType
    | SetErrorACType
    | ReturnType<typeof changeEntityStatusTaskAC>
