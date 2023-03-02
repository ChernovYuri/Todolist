import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "../../Task";
import {ReduxStoreProviderDecorator} from "../decorators/ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../reducers/store";
import {TaskType} from "../../Todolist";

export default {
    taskTitle: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator],
    /*args: {
        todolistID: 'todolistId',
        task: {id: 'taskId', title: 'Example of completed task', isDone: true},
        removeTask: action('Task removed'),
        changeTaskStatus: action('Task status changed'),
        updateTask: action('Task title updated')
    }*/
} as ComponentMeta<typeof Task>;

const TaskCopy = () => {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])
    return <Task task={task} todolistId={'todolistId1'}/>
}

const Template: ComponentStory<typeof Task> = (args) => <TaskCopy /*{...args}*/ />;
export const TaskIsDoneStory = Template.bind({});
/*

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    task: {id: 'taskId', title: 'Example of not completed task', isDone: false},
}

const TemplateFull: ComponentStory<typeof Task> = (args) => {
    let [title, setTitle] = useState('Example')
    let [task, setTask] = useState({id: 'taskId', title: title, isDone: false})

    /!*function removeTask () {
        console.log('Task will be removed')
    }*!/

    function changeTaskStatus (taskId: string, newIsDone: boolean) {
        setTask({...task, isDone: newIsDone})
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
