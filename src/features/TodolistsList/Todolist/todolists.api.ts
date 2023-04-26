import {instance} from "common/api/common.api";
import {ResponseType} from "common/types/common.types";

export const todolistsApi = {
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
    }
}

// types
export type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}
export type UpdateTodolistType = {
    todolistId: string,
    newTitle: string
}


