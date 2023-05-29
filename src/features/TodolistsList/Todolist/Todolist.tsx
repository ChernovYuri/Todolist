import React, {FC, memo, useCallback} from "react";
import {AddItemForm} from "common/components/AddItemForm";
import {TodolistDomainType} from "features/TodolistsList/Todolist/todolistsReducer";
import {tasksThunks} from "features/TodolistsList/tasks/tasksReducer";
import {useActions} from "common/hooks/useActions";
import {FilterTasksButtons} from "features/TodolistsList/Todolist/FilterTaskButtons/FilterTasksButtons";
import {Tasks} from "features/TodolistsList/Todolist/Tasks/Tasks";
import {TodolistTitle} from "features/TodolistsList/Todolist/TodolistTitle/TodolistTitle";

type Props = {
    todolist: TodolistDomainType
}

export const Todolist: FC<Props> = memo(({todolist}) => {
    let {id, filter, entityStatus} = todolist

    const {createTask} = useActions(tasksThunks)

    const createTaskHandler = (title: string) => {
        return createTask({todolistId: todolist.id, title}).unwrap()
    }

    return (
        <div className="App">
            <div>
                <TodolistTitle key={id} todolist={todolist}/>
                <AddItemForm addItem={createTaskHandler}
                             disabled={entityStatus === 'loading'}/>
                <FilterTasksButtons key={id}
                                    filter={filter}
                                    todolistId={id}/>
                <ul>
                    <Tasks key={id} todolist={todolist}/>
                </ul>
            </div>
        </div>
    );
})