import React, {FC, memo, useCallback} from 'react';
import Button from "@mui/material/Button";
import {FilterValuesType, todolistsActions} from "features/TodolistsList/Todolist/todolistsReducer";
import {useActions} from "common/hooks/useActions";

type Props = {
    filter: FilterValuesType
    todolistId: string
}

export const FilterTasksButtons: FC<Props> = memo(({filter, todolistId}) => {
    const {changeFilterTodo} = useActions(todolistsActions)

    const changeFilterHandler = useCallback((filter: FilterValuesType) => () => {
        changeFilterTodo({todolistId, filter})
    }, [])

    return (
        <div>
            <Button variant={filter === 'all' ? 'outlined' : "contained"} color='success'
                    onClick={changeFilterHandler('all')}>All</Button>
            <Button variant={filter === 'active' ? 'outlined' : "contained"} color='error'
                    onClick={changeFilterHandler('active')}>Active</Button>
            <Button variant={filter === 'completed' ? 'outlined' : "contained"} color='secondary'
                    onClick={changeFilterHandler('completed')}>Completed</Button>
        </div>
    );
})