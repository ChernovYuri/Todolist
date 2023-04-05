import axios, {AxiosResponse} from "axios";
import {RequestStatusType} from "../app/app-reducer";
import {ValuesType} from "../features/Login/Login";
import {number} from "prop-types";

// const settings = {
//     withCredentials: true
// }
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})

// api
export const authApi = {
    // for auth
    login(data: ValuesType) {
        return instance.post<{data: string}, AxiosResponse<ResponseType<{userId: number}>>, ValuesType>(`/auth/login`, data)
    },
    logout() {
        return instance.delete<ResponseType>(`/auth/login`)
    },
     me(){
        return instance.get<ResponseType<UserDataType>>(`/auth/me`)
     }
}

export const todolistApi = {
    // for todolists
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },

    // for tasks
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}

// types

type UserDataType = {
    id: number
    email: string
    login: string
}

export type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum ResultCode {
    OK = 0,
    Error = 1,
    Captcha = 10
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    entityStatus: RequestStatusType
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
// чтобы не дублировать код создаём общий тип с переменным типом data
export type ResponseType<T = {}> = { // {} = дефолтное значение типа T для data
    // PS вместо T могут быть любые символы (буквы и слова)
    data: T
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}

/*type UpdateTodolistResponseType = {
    data: {}
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}
type DeleteTodolistResponseType = {
    data: {}
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}
type CreateTodolistResponseType = {
    data: {
        item: TodolistType
    }
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}*/