// src/stories/TODOLIST/todolists-api.stories.tsx
import React, {useEffect, useState} from 'react'
import {todolistApi} from "features/TodolistsList/todolist.api";

export default {
    title: 'API'
}
// TODOLISTS:
export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todolistApi.getTodolists()
            .then((res) => {
                setState(res.data.map(td => td.title + ' ' + td.id))
                // setState(res.data.map(td=>td.title))
            })
            .catch((err) => {
                console.warn(err)
            })
            .finally()
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'Todolist'
        todolistApi.createTodolist(title)
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = ''
        const newTitle = 'newTitle'
        todolistApi.updateTodolist({todolistId, newTitle})
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = ''
        todolistApi.deleteTodolist(todolistId)
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}


// TASKS:
export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const getTasks = () => {
        todolistApi.getTasks(todolistId)
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
            .finally()
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <button onClick={getTasks}>Get Task</button>
        </div>
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTaskTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const createTask = () => {
        todolistApi.createTask({todolistId, title})
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <input placeholder={'taskTitle'} value={title}
                   onChange={(e) => {
                       setTaskTitle(e.currentTarget.value)
                   }}/>
            <button onClick={createTask}>Create Task</button>
        </div>
    </div>
}
/*export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [newTitle, setNewTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')

    const updateTask = () => {
        todolistApi.updateTask(todolistId, taskId, newTitle)
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <input placeholder={'taskId'} value={taskId}
                   onChange={(e) => {
                       setTaskId(e.currentTarget.value)
                   }}/>
            <input placeholder={'New Task Title'} value={newTitle}
                   onChange={(e) => {
                       setNewTitle(e.currentTarget.value)
                   }}/>
            <button onClick={updateTask}>Update Task</button>
        </div>
    </div>
}*/
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = ''
        const taskId = ''
        todolistApi.deleteTask({todolistId, taskId})
            .then((res) => {
                setState(res.data)
            })
            .catch((err) => {
                console.warn(err)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
