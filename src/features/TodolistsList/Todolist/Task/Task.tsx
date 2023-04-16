import React, {memo, useCallback} from 'react';
import {SuperCheckbox} from "common/components/SuperCheckbox";
import {EditableSpan} from "common/components/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskDomainType, tasksThunks} from "../../tasksReducer";
import {useAppDispatch} from "app/store";
import {TaskStatuses} from "common/enums/common.enums";

type TaskPropsType = {
    todolistId: string
    task: TaskDomainType
}

export const Task = memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const removeTaskHandler = () => dispatch(tasksThunks.deleteTask({todolistId, taskId: task.id}))

    const changeTaskStatusHandler = useCallback((checkedValue: boolean) => {
        dispatch(tasksThunks.updateTask({todolistId, taskId: task.id, model:{status: checkedValue ? TaskStatuses.Completed : TaskStatuses.New}}))
    }, [task.id])
    const updateTaskHandler = useCallback((newTitle: string) => {
        dispatch(tasksThunks.updateTask({todolistId, taskId: task.id, model:{title: newTitle}}))
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