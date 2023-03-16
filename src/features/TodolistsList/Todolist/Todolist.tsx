import React, {memo, useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Task} from "./Task/Task";
import {useAppDispatch, useAppSelector} from "../../../app/store";
import {
    changeFilterTodolistsAC,
    changeTodoTitleTC,
    deleteTodoTC,
    FilterValuesType,
    TodolistDomainType
} from "../todolistsReducer";
import {createTaskTC, getTasksTC} from "../tasksReducer";
import {TaskType} from "../../../api/todolist-api";

type TodolistPropsType = { /* typing */
    todolist: TodolistDomainType
}

// export type TaskType = {
//     id: string
//     title: string
//     status: boolean
// }

export const Todolist = memo(({todolist}: TodolistPropsType) => {

    console.log('Todolist rendering')

    let {id, title, filter} = todolist

    const dispatch = useAppDispatch()
    let tasks = useAppSelector<TaskType[]>(state => state.tasks[id])

    useEffect(()=>{
        dispatch(getTasksTC(todolist.id))
    },[])

    const getFilteredTasks = () => {
        switch (filter) {
            case "active":
                return tasks.filter(el => !el.status)
            case "completed":
                return tasks.filter(el => el.status)
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
        let action = deleteTodoTC(id)
        dispatch(action)
    }, [dispatch])

    const addTaskHandler = useCallback((title: string) => {
        // let newTask = {
        //     id: v1(),
        //     title: title,
        //     status: TaskStatuses.New,
        //     todoListId: todolist.id,
        //     description: '',
        //     startDate: '',
        //     deadline: '',
        //     addedDate: '',
        //     order: 0,
        //     priority: TaskPriorities.Low
        // }
        dispatch(createTaskTC(id, title))
    }, [dispatch])

    const updateTodolistHandler = useCallback((newTitle: string) => {
        dispatch(changeTodoTitleTC(id, newTitle))
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