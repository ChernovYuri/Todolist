import {TodolistsType} from "../App";
import {addTodolistsAC, removeTodolistsAC, TodolistsReducer} from "./todolistsReducer";
import {TasksReducer} from "./tasksReducer";
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState = {}
    const startTodolistsState: TodolistsType[] = [
        {id: 'todolistID1', title: 'What to learn', filter: 'all'},
        {id: 'todolistID2', title: 'What to buy', filter: 'all'},
    ]
    let newID = v1()
    const action = addTodolistsAC('New Todolist')

    const endTasksState = TasksReducer(startTasksState, action)
    const endTodolistsState = TodolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.newID)
    expect(idFromTodolists).toBe(action.payload.newID)
})

test('property with todolistId should be deleted', () => {
    const startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const action = removeTodolistsAC('todolistId2')

    const endState = TasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})
