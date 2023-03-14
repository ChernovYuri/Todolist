import {TasksType} from "../App";
import {addTodolistsACType, removeTodolistsACType} from "./todolistsReducer";
import {TaskStatuses, TaskType} from "../api/todolist-api";

let initialState: TasksType = {}
export const TasksReducer = (state = initialState, action: actionsType) => {
    switch (action.type) {
        case 'ADD-TASK': {
            // let newTask = {id: v1(), title: title, status: false}
            // setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
            return {
                ...state,
                [action.payload.todolistId]: [action.payload.newTask, ...state[action.payload.todolistId]]
            }
        }
        case 'UPDATE-TASK': {
            // setTasks({
            //     ...tasks, [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, title: newTitle} : el)
            // })
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId ? {
                    ...el,
                    title: action.payload.newTitle
                } : el)
            }
        }
        case 'CHANGE-TASK-STATUS': {
            // setTasks({
            //     ...tasks,
            //     [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, status: newstatus} : el)
            // })
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId ? {
                    ...el,
                    status: action.payload.newStatus
                } : el)
            }
        }
        case 'REMOVE-TASK': {
            // setTasks({...tasks, [todolistID]: tasks[todolistID].filter(el => el.id !== taskId)})
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.taskId)
            }
        }
        case 'ADD-TODOLIST': {
            // setTasks({...tasks, [newID]: []})
            return {...state, [action.payload.newId]: []}
        }
        case 'REMOVE-TODOLIST': {
            // setTasks({...tasks, [newID]: []})
            // delete action.payload.todolistID.key
            let copyState = {...state}
            delete copyState[action.payload.todolistId]
            // деструктуризацией
            // let {[action.todolistId]:[], ...rest} = {...state}
            // return rest
            return copyState
        }
        default:
            return state
    }
}

type actionsType =
    addTaskACType
    | updateTaskACType
    | changeTaskStatusACType
    | removeTaskACType
    | addTodolistsACType
    | removeTodolistsACType

type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todolistId: string, title: string, newTask: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistId,
            title,
            newTask
        }
    } as const
}

type updateTaskACType = ReturnType<typeof updateTaskAC>
export const updateTaskAC = (todolistId: string, taskId: string, newTitle: string) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            taskId,
            newTitle
        }
    } as const
}

type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistId: string, taskId: string, newStatus: TaskStatuses) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            todolistId,
            taskId,
            newStatus
        }
    } as const
}

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistId,
            taskId
        }
    } as const
}

// тип импортирован
/*export const addTodolistsAC = (newID: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newID
        }
    } as const
}*/

/*type addTodolistsAddTasksACType = ReturnType<typeof addTodolistsAddTasksAC>
export const addTodolistsAddTasksAC = (newID: string) => {
    return {
        type: 'ADD-TODOLIST-ADD-TASKS',
        payload: {
            newID
        }
    } as const
}*/

/*
type removeTodolistsRemoveTasksACType = ReturnType<typeof removeTodolistsRemoveTasksAC>
export const removeTodolistsRemoveTasksAC = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST-REMOVE-TASKS',
        payload: {
            todolistID
        }
    } as const
}*/
