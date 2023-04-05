import React, {memo, useCallback} from 'react';
import {SuperCheckbox} from "../../../../components/SuperCheckbox";
import {EditableSpan} from "../../../../components/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteTaskTC, TaskDomainType, updateTaskTC} from "../../tasksReducer";
import {TaskStatuses} from "../../../../api/todolist-api";
import {useAppDispatch} from "../../../../app/store";

type TaskPropsType = {
    task: TaskDomainType
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
                           callback={(checkedValue) => changeTaskStatusHandler(checkedValue)}
                           disabled={task.entityStatus === 'loading'}/>
            <EditableSpan oldTitle={task.title}
                          callBack={updateTaskHandler}
                          taskId={task.id}
                          isEntityStatusLoading={task.entityStatus !== 'loading'}/>
            <IconButton aria-label="delete" onClick={removeTaskHandler}
                        disabled={task.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
})