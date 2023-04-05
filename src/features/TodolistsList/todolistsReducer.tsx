import {ResultCode, todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setErrorAC, SetErrorACType, setStatusAC, SetStatusACType} from "../../app/app-reducer";
import {handleServerAppError, handleServiceNetworkError} from "../../utils/errorUtils";

let initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.payload.todolistId)
        case 'UPDATE-TODOLIST':
            return state.map(el => el.id === action.payload.todolistId ?
                {...el, todolistTitle: action.payload.newTitle} : el)
        case 'CHANGE-FILTER':
            return state.map(el => el.id === action.payload.todolistId ?
                {...el, filter: action.payload.value} : el)
        case 'CHANGE-ENTITY-TODO-STATUS':
            return state.map(el => el.id === action.payload.todolistId ?
                {...el, entityStatus: action.payload.entityStatus} : el)
        case 'ADD-TODOLIST':
            return [{...action.payload.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'SET-TODOLISTS':
            return action.payload.todolists
                .map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
        default:
            return state
    }
}

// actions
export const removeTodolistsAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', payload: {todolistId}} as const)
export const updateTodolistsAC = (todolistId: string, newTitle: string) =>
    ({type: 'UPDATE-TODOLIST', payload: {todolistId, newTitle,}} as const)
export const changeFilterTodolistAC = (todolistId: string, value: FilterValuesType) =>
    ({type: 'CHANGE-FILTER', payload: {todolistId, value}} as const)
export const addTodolistsAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', payload: {todolist}} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', payload: {todolists}} as const)
export const changeEntityStatusTodolistAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-ENTITY-TODO-STATUS', payload: {todolistId, entityStatus}} as const)

// thunks
export const getTodoTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setStatusAC('succeeded'))
        })
        .catch((err)=>{
            handleServiceNetworkError(dispatch, err)
        })
        .finally(()=>{
            dispatch(setStatusAC('idle'))
        })
}

export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeEntityStatusTodolistAC(todolistId, 'loading'))
    todolistApi.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistsAC(todolistId))
            dispatch(setStatusAC('succeeded'))
        })
        .catch((error) => {
            dispatch(setStatusAC('failed'))
            dispatch(changeEntityStatusTodolistAC(todolistId, 'failed'))
            dispatch(setErrorAC(error.message))
        })
}

export const createTodoTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    todolistApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTodolistsAC(res.data.data.item))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
            dispatch(setStatusAC('idle'))
        }).catch((err) => {
        handleServiceNetworkError(dispatch, err)
    })
}

export const changeTodoTitleTC = (id: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeEntityStatusTodolistAC(id, 'loading'))
    todolistApi.updateTodolist(id, title)
        .then((res) => {
            console.log(res)
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(updateTodolistsAC(id, title))
                dispatch(changeEntityStatusTodolistAC(id, 'idle'))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch(err => {
        handleServiceNetworkError(dispatch, err)
    })
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type RemoveTodolistsACType = ReturnType<typeof removeTodolistsAC>
export type AddTodolistsACType = ReturnType<typeof addTodolistsAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
type ActionsType =
    | RemoveTodolistsACType
    | AddTodolistsACType
    | SetTodolistsACType
    | ReturnType<typeof updateTodolistsAC>
    | ReturnType<typeof changeFilterTodolistAC>
    | ReturnType<typeof changeEntityStatusTodolistAC>
    | SetStatusACType
    | SetErrorACType


