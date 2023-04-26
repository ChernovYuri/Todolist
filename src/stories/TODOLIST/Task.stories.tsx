import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Task} from "features/TodolistsList/Todolist/Tasks/Task/Task";
import {ReduxStoreProviderDecorator} from "../decorators/ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {TaskDomainType} from "features/TodolistsList/tasks/tasksReducer";

export default {
    taskTitle: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator],
    /*args: {
        todolistID: 'todolistId',
        task: {id: 'taskId', title: 'Example of completed task', status: true},
        removeTask: action('Task removed'),
        changeTaskStatus: action('Task status changed'),
        updateTask: action('Task title updated')
    }*/
} as ComponentMeta<typeof Task>;

const TaskCopy = () => {
    const task = useSelector<AppRootStateType, TaskDomainType>(state => state.tasks['todolistId1'][0])
    return <Task task={task} todolistId={'todolistId1'}/>
}

const Template: ComponentStory<typeof Task> = (args) => <TaskCopy /*{...args}*/ />;
export const TaskstatusStory = Template.bind({});
/*

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    task: {id: 'taskId', title: 'Example of not completed task', status: false},
}

const TemplateFull: ComponentStory<typeof Task> = (args) => {
    let [title, setTitle] = useState('Example')
    let [task, setTask] = useState({id: 'taskId', title: title, status: false})

    /!*function removeTask () {
        console.log('Task will be removed')
    }*!/

    function changeTaskStatus (taskId: string, newstatus: boolean) {
        setTask({...task, status: newstatus})
    }

    function updateTask (taskId: string, newTitle: string) {
        setTitle(newTitle)
        setTask({...task, title: newTitle})
    }

    return <Task
        todolistId={'todolistId'}
        task={task}
    />
}

export const TaskStory = TemplateFull.bind({});*/
