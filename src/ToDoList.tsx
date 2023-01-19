import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';

type ToDoListPropsType = { /* typing */
    todolistID: string
    title: string
    tasks: Array<TaskType>
    removeTodolist: (todolistID: string) => void
    removeTask: (todolistID: string, taskId: string) => void
    changeTodoFilter: (filter: FilterValuesType) => void
    addTask: (todolistID: string, title: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, newIsDone: boolean) => void
    filter: string
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    updateTask: (todolistID: string, taskId: string, newTitle: string) => void
    updateTodolist: (todolistId: string, newTitle: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


const ToDoList = (props: ToDoListPropsType) => {
    // const [title, setTitle] = useState<string>('')
    // const [error, setError] = useState<boolean>(false)

    const updateTaskHandler = (taskId: string, newTitle: string) => {
        props.updateTask(props.todolistID, taskId, newTitle)
    }

    const tasksItems = props.tasks.length ?
        props.tasks.map((task: TaskType) => {
            const onChangeSetTaskStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(props.todolistID, task.id, e.currentTarget.checked)
            const removeTaskHandler = () => props.removeTask(props.todolistID, task.id)
            const isDoneClass = task.isDone ? 'isDone' : 'notIsDone'

            // const updateTaskHandler = (newTitle: string) => {
            //     props.updateTask(props.todolistID, task.id, newTitle)
            // }

            return (
                <li key={task.id}>
                    {/*<input type="checkbox"
                           checked={task.isDone}
                           onChange={onChangeSetTaskStatus}
                    />*/}
                    <Checkbox
                        onChange={onChangeSetTaskStatus}
                              checked={task.isDone} />
                    <EditableSpan oldTitle={task.title} callBack={(newTitle)=>updateTaskHandler(task.id, newTitle)}/>
                    {/*<span className={isDoneClass}>{task.title}</span>*/}
                    {/*<Button variant="outlined" className={'deleteButton'} onClick={removeTaskHandler}>X</Button>*/}
                    <IconButton aria-label="delete" onClick={removeTaskHandler}>
                        <DeleteIcon />
                    </IconButton>
                </li>)
        })
        : <span>There are will be your tasks</span>  // условный рендеринг (прелоадинг)/контроль списка на пустоту

    // const onClickAddTaskToDoListHandler = () => {
    //     const trimmedTitle = title.trim()
    //     if (trimmedTitle) {
    //         props.addTask(props.todolistId, trimmedTitle)
    //     } else {
    //         setError(true)
    //     }
    //     setTitle('')
    // }

    // const onKeyDownAddTaskToDoListHandler = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onClickAddTaskToDoListHandler()

    // const onChangeLocalTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    //     setError(false)
    //     setTitle(e.currentTarget.value)
    // }

    // const onClickSetAllFilterHandler = () => props.changeFilter('all')
    // const onClickSetActiveFilterHandler = () => props.changeFilter('active')
    // const onClickSetCompletedFilterHandler = () => props.changeFilter('completed')

    const getOnClickSetFilterHandler = (value: FilterValuesType) => () => props.changeFilter(props.todolistID, value)
    const filterStyle = (filterStatus: string) => props.filter === filterStatus ? 'openedFilter' : 'closedFilter'
    // const errorMessage = error && <div style={{color: 'red'}}>Field is empty</div>

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistID)
    }

    const addTaskHandler = (title: string) => {
        props.addTask(props.todolistID, title)
    }

    const updateTodolistHandler = (newTitle: string) => {
        props.updateTodolist(props.todolistID, newTitle)
    }

    return (
        <div className="App">
            <div>
                <h3>
                    {/*{props.title}*/}
                    <EditableSpan oldTitle={props.title} callBack={updateTodolistHandler} />
                    <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                        <DeleteIcon />
                    </IconButton>
                </h3>
                <AddItemForm callback={addTaskHandler}/>
                {/*<div>*/}
                {/*    <input*/}
                {/*        value={title}*/}
                {/*        onChange={onChangeLocalTitleHandler}*/}
                {/*        onKeyDown={onKeyDownAddTaskToDoListHandler}*/}
                {/*        className={error ? 'inputError' : ''}*/}

                {/*    />*/}
                {/*    <button onClick={onClickAddTaskToDoListHandler}>+</button>*/}
                {/*    {errorMessage}*/}
                {/*</div>*/}
                <ul>
                    {tasksItems}
                </ul>
                <div>

                    <Button variant={props.filter === 'all' ? 'outlined' : "contained"} color='success' onClick={getOnClickSetFilterHandler('all')}>All</Button>
                    <Button variant={props.filter === 'active' ? 'outlined' : "contained"} color='error' onClick={getOnClickSetFilterHandler('active')}>Active</Button>
                    <Button variant={props.filter === 'completed' ? 'outlined' : "contained"} color='secondary' onClick={getOnClickSetFilterHandler('completed')}>Completed</Button>


                    {/*<button className={filterStyle('all')}*/}
                    {/*        onClick={getOnClickSetFilterHandler('all')}>All*/}
                    {/*</button>*/}
                    {/*<button className={filterStyle('active')}*/}
                    {/*        onClick={getOnClickSetFilterHandler('active')}>Active*/}
                    {/*</button>*/}
                    {/*<button className={filterStyle('completed')}*/}
                    {/*        onClick={getOnClickSetFilterHandler('completed')}>Completed*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    );
}

export default ToDoList;