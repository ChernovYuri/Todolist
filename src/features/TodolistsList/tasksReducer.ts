import {AddTodolistsACType, RemoveTodolistsACType, SetTodolistsACType} from "./todolistsReducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";

let initialState: TasksType = {}
export const TasksReducer = (state: TasksType = initialState, action: actionsType) => {
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
        case "SET-TASKS":
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        case 'ADD-TASK':
            return {
                ...state, [action.payload.todolistId]: [action.payload.newTask, ...state[action.payload.todolistId]]
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
        default:
            return state
    }
}

// actions
export const addTaskAC = (todolistId: string, newTask: TaskType) =>
    ({type: 'ADD-TASK', payload: {todolistId, newTask}} as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    ({type: 'UPDATE-TASK', payload: {todolistId, taskId, model}} as const)
export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', payload: {todolistId, taskId}} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', payload: {todolistId, tasks}} as const)

// thunks
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistApi.getTasks(todolistId)
        .then((res) => {
            // const {items, error, totalCount} = res.data
            // const items = res.data.items
            // console.log(items)
            dispatch(setTasksAC(todolistId, res.data.items))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTask(todolistId, taskId)
        .then((res) => {
            // const {items, error, totalCount} = res.data
            // console.log(items)
            dispatch(removeTaskAC(todolistId, taskId))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.createTask(todolistId, title)
        .then((res) => {
            // const {items, error, totalCount} = res.data
            // console.log(items)

            dispatch(addTaskAC(todolistId, res.data.data.item))
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {

    const task = getState().tasks[todolistId].find((task) => task.id === taskId)

    if (task) {
        let apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            ...domainModel
        }
        todolistApi.updateTask(todolistId, taskId, apiModel)
            .then((res) => {
                // const {items, error, totalCount} = res.data
                // console.log(items)
                dispatch(updateTaskAC(todolistId, taskId, domainModel))
            })
    }
}

// types
export type TasksType = {
    [key: string]: TaskType[]
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type actionsType =
    | AddTodolistsACType
    | RemoveTodolistsACType
    | SetTodolistsACType
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof setTasksAC>
