import {TaskDomainType} from "features/TodolistsList/tasks/tasksReducer";
import {Task} from "features/TodolistsList/Todolist/Tasks/Task/Task";
import React, {FC, memo} from "react";
import {useAppSelector} from "common/hooks/useAppSelector";
import {selectTasks} from "features/TodolistsList/tasks/tasks.selectors";
import {TodolistDomainType} from "features/TodolistsList/Todolist/todolistsReducer";

type Props = {
    todolist: TodolistDomainType
}

export const Tasks: FC<Props> = memo(({todolist}) => {

    const tasks = useAppSelector<TaskDomainType[]>(selectTasks(todolist.id))
    const getFilteredTasks = () => {
        switch (todolist.filter) {
            case "active":
                return tasks.filter(el => !el.status)
            case "completed":
                return tasks.filter(el => el.status)
            default:
                return tasks
        }
    }
    const filteredTasks = getFilteredTasks()
    return filteredTasks.length ?
        <>
            {filteredTasks.map((task: TaskDomainType) => (
                <Task
                    key={task.id}
                    todolistId={todolist.id}
                    task={task}
                />
            ))}
        </>
        : <span>Here will be your tasks</span>  // условный рендеринг (прелоадинг)/контроль списка на пустоту
})