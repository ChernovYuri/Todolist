import {v1} from "uuid";
import {TodolistType} from "../api/todolist-api";

type actionsType = removeTodolistsACType | updateTodolistsACType
    | changeFilterTodolistsACType | addTodolistsACType

let initialState:  TodolistDomainType[] = []

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}


export const TodolistsReducer = (state: TodolistDomainType[] = initialState , action: actionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            // setTodolists(todolists.filter(el => el.id !== todolistID))
            // delete tasks[todolistID]
            return state.filter(el => el.id !== action.payload.todolistId)
        }
        case 'UPDATE-TODOLIST': {
            //  setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: newTitle} : el))
            return state.map(el => el.id === action.payload.todolistId ? {...el, todolistTitle: action.payload.newTitle} : el)
        }
        case 'CHANGE-FILTER': {
            //     setTodolists(todolists.map(el => el.id === todolistId ? {...el, filter: value} : el))
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        }
        case 'ADD-TODOLIST': {
            // let newID = v1()
            // let newTodo: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
            // setTodolists([newTodo, ...todolists])
            // setTasks({...tasks, [newID]: []})
            return [{
                id: action.payload.newId,
                title: action.payload.newTitle,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        default:
            return state
    }
}


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