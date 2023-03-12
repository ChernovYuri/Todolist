import React, {memo, useCallback, useMemo} from "react";
import {FilterValuesType, TodolistType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Task} from "./Task";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {changeFilterTodolistsAC, removeTodolistsAC, updateTodolistsAC} from "./reducers/todolistsReducer";
import {v1} from "uuid";
import {addTaskAC} from "./reducers/tasksReducer";

type TodolistPropsType = { /* typing */
    todolist: TodolistType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = memo(({todolist}: TodolistPropsType) => {

    console.log('Todolist rendering')

    let {id, title, filter} = todolist

    const dispatch = useDispatch()
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])

    const getFilteredTasks = () => {
        switch (filter) {
            case "active":
                return tasks.filter(el => !el.isDone)
            case "completed":
                return tasks.filter(el => el.isDone)
            default:
                return tasks
        }
    }
    // useMemo запоминает результат работы функции, здесь его использование избыточно, для учебного примера
    // tasks = useMemo(getFilteredTasks,[filter, tasks])
    tasks = getFilteredTasks()
    const tasksItems = tasks.length ?
        tasks.map((task: TaskType) => {
            return <Task
                key={task.id}
                task={task}
                todolistId={id}
            />
        })
        : <span>Here will be your tasks</span>  // условный рендеринг (прелоадинг)/контроль списка на пустоту

    const getOnClickSetFilterHandler = useCallback((value: FilterValuesType) => () => {
        dispatch(changeFilterTodolistsAC(id, value))
}, [dispatch])

    const removeTodolistHandler = useCallback(() => {
        let action = removeTodolistsAC(id)
        dispatch(action)
    }, [dispatch])

    const addTaskHandler = useCallback((title: string) => {
        let newTask = {id: v1(), title: title, isDone: false}
        dispatch(addTaskAC(id, title, newTask))
    }, [dispatch])

    const updateTodolistHandler = useCallback((newTitle: string) => {
        dispatch(updateTodolistsAC(id, newTitle))
    }, [dispatch])


    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan oldTitle={title} callBack={updateTodolistHandler}/>
                    <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </h3>
                <AddItemForm callback={addTaskHandler}/>
                <div>
                    <Button variant={filter === 'all' ? 'outlined' : "contained"} color='success'
                            onClick={getOnClickSetFilterHandler('all')}>All</Button>
                    <Button variant={filter === 'active' ? 'outlined' : "contained"} color='error'
                            onClick={getOnClickSetFilterHandler('active')}>Active</Button>
                    <Button variant={filter === 'completed' ? 'outlined' : "contained"} color='secondary'
                            onClick={getOnClickSetFilterHandler('completed')}>Completed</Button>
                </div>
                <ul>
                    {tasksItems}
                </ul>
            </div>
        </div>
    );
})