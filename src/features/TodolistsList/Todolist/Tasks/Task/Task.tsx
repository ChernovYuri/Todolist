import React, {FC, memo, useCallback} from 'react';
import {SuperCheckbox} from "common/components/SuperCheckbox";
import {EditableSpan} from "common/components/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskDomainType, tasksThunks} from "features/TodolistsList/tasks/tasksReducer";
import {TaskStatuses} from "common/enums/common.enums";
import {useActions} from "common/hooks/useActions";

type Props = {
    todolistId: string
    task: TaskDomainType
}

export const Task: FC<Props> = memo(({task, todolistId}) => {
    const {deleteTask, updateTask} = useActions(tasksThunks)

    const deleteTaskHandler = () => deleteTask({todolistId, taskId: task.id})

    const changeTaskStatusHandler = useCallback((checkedValue: boolean) => {
        updateTask({
            todolistId,
            taskId: task.id,
            model: {status: checkedValue ? TaskStatuses.Completed : TaskStatuses.New}
        })
    }, [task.id])
    const updateTaskHandler = useCallback((newTitle: string) => {
        updateTask({todolistId, taskId: task.id, model: {title: newTitle}})
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
            <IconButton aria-label="delete" onClick={deleteTaskHandler}
                        disabled={task.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
})