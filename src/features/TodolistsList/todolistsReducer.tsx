import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";

let initialState: TodolistDomainType[] = []

export const TodolistsReducer = (state: TodolistDomainType[] = initialState, action: actionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.payload.todolistId)
        case 'UPDATE-TODOLIST':
            return state.map(el => el.id === action.payload.todolistId ?
                {...el, todolistTitle: action.payload.newTitle} : el)
        case 'CHANGE-FILTER':
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        case 'ADD-TODOLIST':
            return [{...action.payload.todolist, filter: 'all'}, ...state]
        case 'SET-TODOLISTS':
            return action.payload.todolists.map(todo => ({...todo, filter: 'all'}))
        default:
            return state
    }
}

// actions
export const removeTodolistsAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', payload: {todolistId}} as const)
export const updateTodolistsAC = (todolistId: string, newTitle: string) =>
    ({type: 'UPDATE-TODOLIST', payload: {todolistId, newTitle,}} as const)
export const changeFilterTodolistsAC = (todolistId: string, value: FilterValuesType) =>
    ({type: 'CHANGE-FILTER', payload: {todolistId, value}} as const)
export const addTodolistsAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', payload: {todolist}} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', payload: {todolists}} as const)

// thunks
export const getTodoTC = () => (dispatch: Dispatch) => {
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
}

export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistsAC(todolistId))
        })
}

export const createTodoTC = (title: string) => (dispatch: Dispatch) => {
    todolistApi.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistsAC(res.data.data.item))
        })
}

export const changeTodoTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.updateTodolist(id, title)
        .then((res) => {
            dispatch(updateTodolistsAC(id, title))
        })
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export type RemoveTodolistsACType = ReturnType<typeof removeTodolistsAC>
export type AddTodolistsACType = ReturnType<typeof addTodolistsAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
type actionsType =
    | RemoveTodolistsACType
    | AddTodolistsACType
    | SetTodolistsACType
    | ReturnType<typeof updateTodolistsAC>
    | ReturnType<typeof changeFilterTodolistsAC>


