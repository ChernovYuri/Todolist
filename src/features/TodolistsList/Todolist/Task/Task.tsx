import React, {memo, useCallback} from 'react';
import {SuperCheckbox} from "../../../../components/SuperCheckbox";
import {EditableSpan} from "../../../../components/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteTaskTC, updateTaskTC} from "../../tasksReducer";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {useAppDispatch} from "../../../../app/store";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task = memo(({task, todolistId}: TaskPropsType) => {
    console.log('Task rendering')
    const dispatch = useAppDispatch()

    const removeTaskHandler = () => dispatch(deleteTaskTC(todolistId, task.id))

    const changeTaskStatusHandler = useCallback((checkedValue: boolean) => {
        dispatch(updateTaskTC(todolistId, task.id, {status: checkedValue ? TaskStatuses.Completed : TaskStatuses.New}))
    }, [task.id])

    const updateTaskHandler = useCallback((newTitle: string) => {
        dispatch(updateTaskTC(todolistId, task.id, {title: newTitle}))
    }, [task.id])

    const checkedHandler = () => {
        return task.status === TaskStatuses.Completed
    }

    return (
        <li key={task.id}>
            <SuperCheckbox checked={checkedHandler()}
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