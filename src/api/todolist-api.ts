import axios from "axios";

// const settings = {
//     withCredentials: true
// }
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})

// api
export const todolistApi = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    /*: Promise<AxiosResponse<{items: TaskType[], totalCount: number, error: any}>>*/
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

// types
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
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
// чтобы не дублировать код создаём общий тип с переменным типом data
type ResponseType<T = {}> = { // {} = дефолтное значение типа T для data
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