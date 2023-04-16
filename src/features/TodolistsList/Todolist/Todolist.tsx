import React, {memo, useCallback} from "react";
import {AddItemForm} from "common/components/AddItemForm";
import {EditableSpan} from "common/components/EditableSpan";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Task} from "./Task/Task";
import {useAppDispatch, useAppSelector} from "app/store";
import {
        FilterValuesType,
    TodolistDomainType, todolistsActions, todolistsThunks
} from "../todolistsReducer";
import {TaskDomainType, tasksThunks} from "../tasksReducer";
import {selectTasks} from "features/TodolistsList/Todolist/Task/tasks.selectors";

type TodolistPropsType = { /* typing */
    todolist: TodolistDomainType
}

// export type TaskType = {
//     id: string
//     title: string
//     status: boolean
// }

export const Todolist = memo(({todolist}: TodolistPropsType) => {
    let {id, title, filter, entityStatus} = todolist

    const dispatch = useAppDispatch()
    const tasks = useAppSelector<TaskDomainType[]>(selectTasks(id))

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
    const filteredTasks = getFilteredTasks()
    const tasksItems = filteredTasks.length ?
        filteredTasks.map((task: TaskDomainType) => {
            return <Task
                key={task.id}
                todolistId={id}
                task={task}
            />
        })
        : <span>Here will be your tasks</span>  // условный рендеринг (прелоадинг)/контроль списка на пустоту

    const getOnClickSetFilterHandler = useCallback((filter: FilterValuesType) => () => {
        dispatch(todolistsActions.changeFilterTodo({todolistId: id, filter}))
    }, [dispatch])

    const removeTodolistHandler = useCallback(() => {
        let action = todolistsThunks.deleteTodo(id)
        dispatch(action)
    }, [dispatch])

    const addTaskHandler = useCallback((title: string) => {
        let todolistId = id
        dispatch(tasksThunks.createTask({todolistId, title}))
    }, [dispatch])

    const updateTodolistHandler = useCallback((newTitle: string) => {
        dispatch(todolistsThunks.updateTodoTitle({todolistId: id, newTitle}))
    }, [dispatch])


    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan oldTitle={title}
                                  callBack={updateTodolistHandler}
                                  isEntityStatusLoading={entityStatus !== 'loading'}/>
                    <IconButton aria-label="delete" onClick={removeTodolistHandler}
                                disabled={entityStatus === 'loading'}>
                        <DeleteIcon/>
                    </IconButton>
                </h3>
                <AddItemForm callback={addTaskHandler} disabled={entityStatus === 'loading'}/>
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