import {FilterValuesType, TodolistsType} from "../App";
import {v1} from "uuid";

let initialState:  TodolistsType[] = []

export const TodolistsReducer = (state = initialState , action: actionsType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            // setTodolists(todolists.filter(el => el.id !== todolistID))
            // delete tasks[todolistID]
            return state.filter(el => el.id !== action.payload.todolistID)
        }
        case 'UPDATE-TODOLIST': {
            //  setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: newTitle} : el))
            return state.map(el => el.id === action.payload.todolistID ? {...el, title: action.payload.newTitle} : el)
        }
        case 'CHANGE-FILTER': {
            //     setTodolists(todolists.map(el => el.id === todolistId ? {...el, filter: value} : el))
            return state.map(el => el.id === action.payload.todolistID ? {...el, filter: action.payload.value} : el)
        }
        case 'ADD-TODOLIST': {
            // let newID = v1()
            // let newTodo: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
            // setTodolists([newTodo, ...todolists])
            // setTasks({...tasks, [newID]: []})
            let newTodo: TodolistsType = {id: action.payload.newID, title: action.payload.newTitle, filter: 'all'}
            return [newTodo, ...state]
        }
        default:
            return state
    }
}

type actionsType = removeTodolistsACType | updateTodolistsACType | changeFilterTodolistsACType | addTodolistsACType

export type removeTodolistsACType = ReturnType<typeof removeTodolistsAC>
export const removeTodolistsAC = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todolistID
        }
    } as const
}
type updateTodolistsACType = ReturnType<typeof updateTodolistsAC>
export const updateTodolistsAC = (todolistID: string, newTitle: string) => {
    return {
        type: 'UPDATE-TODOLIST',
        payload: {
            todolistID,
            newTitle,
        }
    } as const
}

type changeFilterTodolistsACType = ReturnType<typeof changeFilterTodolistsAC>
export const changeFilterTodolistsAC = (todolistID: string, value: FilterValuesType) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            todolistID,
            value
        }
    } as const
}

export type addTodolistsACType = ReturnType<typeof addTodolistsAC>
export const addTodolistsAC = (newTitle: string) => {
    const newID = v1()
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newID,
            newTitle
        }
    } as const
}