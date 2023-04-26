import React, {FC, memo, useCallback} from 'react';
import {EditableSpan} from "common/components/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {useActions} from "common/hooks/useActions";
import {TodolistDomainType, todolistsThunks} from "features/TodolistsList/Todolist/todolistsReducer";

type Props = {
    todolist: TodolistDomainType
}


export const TodolistTitle: FC<Props> = memo(({todolist}) => {
    const {deleteTodo, updateTodoTitle} = useActions(todolistsThunks)

    const deleteTodolistHandler = useCallback(() => {
        deleteTodo(todolist.id)
    }, [])

    const updateTodolistHandler = useCallback((newTitle: string) => {
        updateTodoTitle({todolistId: todolist.id, newTitle})
    }, [])

    return (
        <h3>
            <EditableSpan oldTitle={todolist.title}
                          callBack={updateTodolistHandler}
                          isEntityStatusLoading={todolist.entityStatus !== 'loading'}/>
            <IconButton aria-label="delete" onClick={deleteTodolistHandler}
                        disabled={todolist.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </h3>
    );
})