import {RequestStatusType} from "app/appReducer";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasksReducer";
import {TaskPriorities, TaskStatuses} from "common/enums/common.enums";
import {instance} from "common/api/common.api";
import {ResponseType} from "common/types/common.types";

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
    updateTodolist(arg: UpdateTodolistType) {
        return instance.put<ResponseType>(`todo-lists/${arg.todolistId}`, {title: arg.newTitle})
    },

    // for tasks
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(arg: DeleteTaskArgType) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
    },
    createTask(arg: CreateTaskArgType) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title})
    },
    updateTask(arg: UpdateTaskArgType) {
        return instance.put<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`, arg.model)
    }
}

// types
export type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
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

export type UpdateTodolistType = {
    todolistId: string,
    newTitle: string
}

export type CreateTaskArgType = {
    todolistId: string
    title: string
}
export type DeleteTaskArgType = {
    todolistId: string
    taskId: string
}
export type UpdateTaskArgType = {
    todolistId: string
    taskId: string
    model: UpdateDomainTaskModelType
}
