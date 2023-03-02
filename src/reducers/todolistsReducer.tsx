import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

let initialState:  TodolistType[] = []

export const TodolistsReducer = (state = initialState , action: actionsType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            // setTodolists(todolists.filter(el => el.id !== todolistID))
            // delete tasks[todolistID]
            return state.filter(el => el.todolistId !== action.payload.todolistId)
        }
        case 'UPDATE-TODOLIST': {
            //  setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: newTitle} : el))
            return state.map(el => el.todolistId === action.payload.todolistId ? {...el, todolistTitle: action.payload.newTitle} : el)
        }
        case 'CHANGE-FILTER': {
            //     setTodolists(todolists.map(el => el.id === todolistId ? {...el, filter: value} : el))
            return state.map(el => el.todolistId === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        }
        case 'ADD-TODOLIST': {
            // let newID = v1()
            // let newTodo: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
            // setTodolists([newTodo, ...todolists])
            // setTasks({...tasks, [newID]: []})
            let newTodo: TodolistType = {todolistId: action.payload.newId, todolistTitle: action.payload.newTitle, filter: 'all'}
            return [newTodo, ...state]
        }
        default:
            return state
    }
}

type actionsType = removeTodolistsACType | updateTodolistsACType | changeFilterTodolistsACType | addTodolistsACType

export type removeTodolistsACType = ReturnType<typeof removeTodolistsAC>
export const removeTodolistsAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todolistId
        }
    } as const
}
type updateTodolistsACType = ReturnType<typeof updateTodolistsAC>
export const updateTodolistsAC = (todolistId: string, newTitle: string) => {
    return {
        type: 'UPDATE-TODOLIST',
        payload: {
            todolistId,
            newTitle,
        }
    } as const
}

type changeFilterTodolistsACType = ReturnType<typeof changeFilterTodolistsAC>
export const changeFilterTodolistsAC = (todolistId: string, value: FilterValuesType) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            todolistId,
            value
        }
    } as const
}

export type addTodolistsACType = ReturnType<typeof addTodolistsAC>
export const addTodolistsAC = (newTitle: string) => {
    const newId = v1()
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newId,
            newTitle
        }
    } as const
}