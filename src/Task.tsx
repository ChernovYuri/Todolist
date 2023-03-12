import React, {memo, useCallback} from 'react';
import {TaskType} from "./Todolist";
import {SuperCheckbox} from "./components/SuperCheckbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, removeTaskAC, updateTaskAC} from "./reducers/tasksReducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task = memo(({task, todolistId}: TaskPropsType) => {
    console.log('Task rendering')
    const dispatch = useDispatch()

    const removeTaskHandler = () => dispatch(removeTaskAC(todolistId, task.id))

    const changeTaskStatusHandler = useCallback((newIsDone: boolean) => {
        dispatch(changeTaskStatusAC(todolistId, task.id, newIsDone))
    },[task.id])

    const updateTaskHandler = useCallback((newTitle: string) => {
        dispatch(updateTaskAC(todolistId, task.id, newTitle))
    }, [task.id])


    return (
        <li key={task.id}>
            <SuperCheckbox checked={task.isDone}
                           callback={(checkedValue) => changeTaskStatusHandler(checkedValue)}/>
            <EditableSpan oldTitle={task.title}
                          callBack={updateTaskHandler}
                          taskId={task.id}
            />
            <IconButton aria-label="delete" onClick={removeTaskHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
})