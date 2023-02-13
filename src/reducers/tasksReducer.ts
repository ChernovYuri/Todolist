import {TasksType} from "../App";
import {TaskType} from "../Todolist";
import {addTodolistsACType, removeTodolistsACType} from "./todolistsReducer";

let initialState: TasksType = {}
export const TasksReducer = (state = initialState, action: actionsType) => {
    switch (action.type) {
        case 'ADD-TASK': {
            // let newTask = {id: v1(), title: title, isDone: false}
            // setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
            return {
                ...state,
                [action.payload.todolistID]: [action.payload.newTask, ...state[action.payload.todolistID]]
            }
        }
        case 'UPDATE-TASK': {
            // setTasks({
            //     ...tasks, [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, title: newTitle} : el)
            // })
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {
                    ...el,
                    title: action.payload.newTitle
                } : el)
            }
        }
        case 'CHANGE-TASK-STATUS': {
            // setTasks({
            //     ...tasks,
            //     [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, isDone: newIsDone} : el)
            // })
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {
                    ...el,
                    isDone: action.payload.newIsDone
                } : el)
            }
        }
        case 'REMOVE-TASK': {
            // setTasks({...tasks, [todolistID]: tasks[todolistID].filter(el => el.id !== taskId)})
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(el => el.id !== action.payload.taskID)
            }
        }
        case 'ADD-TODOLIST': {
            // setTasks({...tasks, [newID]: []})
            return {...state, [action.payload.newID]: []}
        }
        case 'REMOVE-TODOLIST': {
            // setTasks({...tasks, [newID]: []})
            // delete action.payload.todolistID.key
            let copyState = {...state}
            delete copyState[action.payload.todolistID]
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
export const addTaskAC = (todolistID: string, title: string, newTask: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistID,
            title,
            newTask
        }
    } as const
}

type updateTaskACType = ReturnType<typeof updateTaskAC>
export const updateTaskAC = (todolistID: string, taskID: string, newTitle: string) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistID,
            taskID,
            newTitle
        }
    } as const
}

type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistID: string, taskID: string, newIsDone: boolean) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            todolistID,
            taskID,
            newIsDone
        }
    } as const
}

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todolistID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistID,
            taskID
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
