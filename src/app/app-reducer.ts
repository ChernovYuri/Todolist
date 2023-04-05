const initialState = {
    error: null as string | null,
    status: 'idle' as RequestStatusType
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionstype): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.payload.error}
        default:
            return state
    }
}

// actions
export const setStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', payload: {status}} as const)
export const setErrorAC = (error: string | null) =>
    ({type: 'APP/SET-ERROR', payload: {error}} as const)


// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = typeof initialState
export type SetStatusACType = ReturnType<typeof setStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>
export type AppActionstype =
    | SetStatusACType
    | SetErrorACType