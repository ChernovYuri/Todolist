import React from 'react';
import {AppRootStateType, store} from "../../reducers/store";
import {Provider} from "react-redux";
import {combineReducers, createStore, legacy_createStore} from "redux";
import {TasksReducer} from "../../reducers/tasksReducer";
import {TodolistsReducer} from "../../reducers/todolistsReducer";
import { v1 } from 'uuid'

const rootReducer = combineReducers({
    tasks: TasksReducer,
    todolists: TodolistsReducer
})
const initialGlobalState = {
    todolists: [
        {todolistId: 'todolistId1', todolistTitle: 'What to learn', filter: 'all'},
        {todolistId: 'todolistId2', todolistTitle: 'What to buy', filter: 'all'}
    ],
    tasks: {
        ['todolistId1']: [
            {taskId: v1(), taskTitle: 'HTML&CSS', isDone: true},
            {taskId: v1(), taskTitle: 'JS', isDone: false}
        ],
        ['todolistId2']: [
            {taskId: v1(), taskTitle: 'Milk', isDone: true},
            {taskId: v1(), taskTitle: 'React Book', isDone: false}
        ]
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return (
        <Provider store={storyBookStore}>
            {storyFn()}
        </Provider>
    );
};